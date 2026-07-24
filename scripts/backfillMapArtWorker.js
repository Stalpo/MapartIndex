// Child process used by scripts/backfillDuplicateHashes.js to hash a single MapArt's chunks in
// isolation. Some MapArts are large enough that decoding them can still use a lot of memory even
// with the streaming approach in util/imageHash.js; running each one in its own process means a
// single oversized image getting OOM-killed only takes down this worker, not the whole backfill.
const imageHash = require('../util/imageHash');

process.on('message', async ({ filePath, width, height }) => {
  try {
    const result = await imageHash.hashMapArtChunks(filePath, width, height);
    process.send({ ok: true, result });
  } catch (error) {
    process.send({ ok: false, error: error.message });
  } finally {
    process.exit(0);
  }
});
