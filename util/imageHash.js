const fs = require('fs');
const crypto = require('crypto');
const { PNG } = require('pngjs');

const CHUNK_SIZE = 128;

// Decode a PNG file into its raw dimensions + RGBA pixel buffer
const decodePng = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(new PNG())
      .on('error', reject)
      .on('parsed', function () {
        resolve({ width: this.width, height: this.height, data: this.data });
      });
  });
};

// Hash a raw pixel buffer (order/format must already be consistent between callers)
const hashPixelBuffer = (buffer) => {
  return crypto.createHash('md5').update(buffer).digest('hex');
};

// Hash a MapId image, validating it is exactly 128x128. Returns null on bad dimensions.
const hashMapIdImage = async (filePath) => {
  const { width, height, data } = await decodePng(filePath);
  if (width !== CHUNK_SIZE || height !== CHUNK_SIZE) {
    return null;
  }
  return hashPixelBuffer(data);
};

// Copy out a single 128x128 RGBA chunk at grid position (chunkX, chunkY) from a full image buffer
const extractChunkBuffer = (fullData, fullWidth, chunkX, chunkY) => {
  const chunk = Buffer.alloc(CHUNK_SIZE * CHUNK_SIZE * 4);
  for (let row = 0; row < CHUNK_SIZE; row++) {
    const srcStart = ((chunkY * CHUNK_SIZE + row) * fullWidth + chunkX * CHUNK_SIZE) * 4;
    const destStart = row * CHUNK_SIZE * 4;
    fullData.copy(chunk, destStart, srcStart, srcStart + CHUNK_SIZE * 4);
  }
  return chunk;
};

// Hash a MapArt image as a whole, and slice+hash it into a gridWidth x gridHeight grid of 128x128 chunks.
// Validates the decoded image matches the expected grid dimensions. Returns null on mismatch.
const hashMapArtChunks = async (filePath, gridWidth, gridHeight) => {
  const { width, height, data } = await decodePng(filePath);
  if (width !== gridWidth * CHUNK_SIZE || height !== gridHeight * CHUNK_SIZE) {
    return null;
  }

  const pixelHash = hashPixelBuffer(data);
  const chunks = [];
  for (let cy = 0; cy < gridHeight; cy++) {
    for (let cx = 0; cx < gridWidth; cx++) {
      const chunkBuffer = extractChunkBuffer(data, width, cx, cy);
      chunks.push({ x: cx, y: cy, hash: hashPixelBuffer(chunkBuffer) });
    }
  }

  return { pixelHash, chunks };
};

module.exports = {
  CHUNK_SIZE,
  decodePng,
  hashPixelBuffer,
  hashMapIdImage,
  extractChunkBuffer,
  hashMapArtChunks,
};
