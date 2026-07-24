const crypto = require('crypto');
const sharp = require('sharp');

// Disable sharp's internal operation cache (defaults to retaining up to 50MB / 20 items / 100
// files of decoded pixel data across calls) and cap decode concurrency to 1. Neither is needed
// for one-shot sequential hashing, and both can otherwise accumulate memory across a long-running
// backfill that decodes thousands of distinct images back to back.
sharp.cache(false);
sharp.concurrency(1);

const CHUNK_SIZE = 128;
const CHANNELS = 4; // force RGBA output so hashing is consistent regardless of source alpha/color type

const hashPixelBuffer = (buffer) => crypto.createHash('md5').update(buffer).digest('hex');

const getDimensions = async (filePath) => {
  const metadata = await sharp(filePath).metadata();
  return { width: metadata.width, height: metadata.height };
};

// Hash a MapId image, validating it is exactly 128x128. Returns null on bad dimensions.
// Small and fixed-size, so a single buffered read is fine here.
const hashMapIdImage = async (filePath) => {
  const { width, height } = await getDimensions(filePath);
  if (width !== CHUNK_SIZE || height !== CHUNK_SIZE) {
    return null;
  }
  const raw = await sharp(filePath).ensureAlpha().raw().toBuffer();
  return hashPixelBuffer(raw);
};

// Hash a MapArt image as a whole, and slice+hash it into a gridWidth x gridHeight grid of
// 128x128 chunks. Validates the decoded image matches the expected grid dimensions, returning
// null on mismatch.
//
// Decodes via a top-to-bottom sequential pixel stream and only ever holds one 128px-tall row
// band (the height of a single chunk row) in memory at a time, instead of the whole raster.
// This matters because some MapArts are large enough (thousands of chunks) that buffering the
// full decoded image at once can exhaust available memory and get the process OOM-killed.
const hashMapArtChunks = async (filePath, gridWidth, gridHeight) => {
  const { width, height } = await getDimensions(filePath);
  if (width !== gridWidth * CHUNK_SIZE || height !== gridHeight * CHUNK_SIZE) {
    return null;
  }

  const rowBytes = width * CHANNELS;
  const bandBytes = rowBytes * CHUNK_SIZE;

  return new Promise((resolve, reject) => {
    const chunks = [];
    const wholeImageHash = crypto.createHash('md5');
    let queue = [];
    let queuedBytes = 0;
    let bandY = 0;
    let settled = false;

    const stream = sharp(filePath, { sequentialRead: true }).ensureAlpha().raw();

    const fail = (error) => {
      if (settled) return;
      settled = true;
      stream.destroy();
      reject(error);
    };

    const processBand = (band) => {
      for (let cx = 0; cx < gridWidth; cx++) {
        const chunkHash = crypto.createHash('md5');
        const colOffset = cx * CHUNK_SIZE * CHANNELS;
        for (let row = 0; row < CHUNK_SIZE; row++) {
          const start = row * rowBytes + colOffset;
          chunkHash.update(band.subarray(start, start + CHUNK_SIZE * CHANNELS));
        }
        chunks.push({ x: cx, y: bandY, hash: chunkHash.digest('hex') });
      }
      bandY++;
    };

    stream.on('data', (data) => {
      wholeImageHash.update(data);
      queue.push(data);
      queuedBytes += data.length;

      // Only concat once we've actually accumulated enough for a full band, and only the bytes
      // currently queued - not on every single incoming stream chunk - to avoid re-copying the
      // same pending bytes repeatedly.
      while (queuedBytes >= bandBytes) {
        const combined = queue.length === 1 ? queue[0] : Buffer.concat(queue, queuedBytes);
        processBand(combined.subarray(0, bandBytes));

        const remainder = combined.subarray(bandBytes);
        queue = remainder.length ? [remainder] : [];
        queuedBytes = remainder.length;
      }
    });

    stream.on('end', () => {
      if (settled) return;
      settled = true;
      resolve({ pixelHash: wholeImageHash.digest('hex'), chunks });
    });

    stream.on('error', fail);
  });
};

module.exports = {
  CHUNK_SIZE,
  hashPixelBuffer,
  hashMapIdImage,
  hashMapArtChunks,
};
