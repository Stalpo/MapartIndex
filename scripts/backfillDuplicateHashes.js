// One-off backfill for the duplicate-check system.
//
// Populates MapId.pixelHash, MapArt.pixelHash, and MapArtChunk rows for
// records that predate the duplicate-check feature. Safe to re-run: it only
// touches records that are missing a pixelHash.
//
// MapArts are hashed in an isolated child process (see backfillMapArtWorker.js) because some
// MapArts are large enough (thousands of 128x128 chunks) that decoding them can use a lot of
// memory. If a single oversized image gets OOM-killed by the OS, only that worker dies - this
// script logs it as skipped and keeps going instead of the whole run dying with it.
//
// Usage:
//   node scripts/backfillDuplicateHashes.js
//   node scripts/backfillDuplicateHashes.js --reset   (clears ALL existing pixelHash/chunk data
//     first - required once after changing the hashing implementation/library, since hashes from
//     different implementations are not guaranteed to be byte-identical for the same image)
const path = require('path');
const fs = require('fs');
const { fork } = require('child_process');

const { prisma } = require('../util/db');
const imageHash = require('../util/imageHash');
const mapIdModel = require('../models/mapIdModel');
const mapArtModel = require('../models/mapArtModel');

const ROOT = path.resolve(__dirname, '..');
const MAPID_DIR = path.join(ROOT, 'public', 'uploads');
const MAPART_DIR = path.join(ROOT, 'public', 'uploads', 'mapart');
const WORKER_PATH = path.join(__dirname, 'backfillMapArtWorker.js');
const BATCH_SIZE = 200;
const WORKER_TIMEOUT_MS = 5 * 60 * 1000;

const RESET = process.argv.includes('--reset');

const missingPixelHashFilter = {
  OR: [
    { pixelHash: null },
    { pixelHash: { isSet: false } },
  ],
};

async function resetExistingHashes() {
  console.log('--reset passed: clearing existing pixelHash/MapArtChunk data...');
  const [mapIdResult, mapArtResult, chunkResult] = await Promise.all([
    prisma.mapId.updateMany({ data: { pixelHash: null } }),
    prisma.mapArt.updateMany({ data: { pixelHash: null } }),
    prisma.mapArtChunk.deleteMany({}),
  ]);
  console.log(`Cleared pixelHash on ${mapIdResult.count} MapIds, ${mapArtResult.count} MapArts, deleted ${chunkResult.count} MapArtChunk rows.`);
}

async function backfillMapIds() {
  console.log('Backfilling MapId pixelHashes...');
  let processed = 0;
  let updated = 0;
  let skipped = 0;
  const unresolvableIds = []; // records that will never get a pixelHash this run (bad file/dims) - must be excluded or the loop never terminates

  while (true) {
    const batch = await prisma.mapId.findMany({
      where: {
        ...missingPixelHashFilter,
        ...(unresolvableIds.length ? { id: { notIn: unresolvableIds } } : {}),
      },
      take: BATCH_SIZE,
    });

    if (batch.length === 0) break;

    for (const mapId of batch) {
      const filePath = path.join(MAPID_DIR, mapId.imgUrl);
      try {
        if (!fs.existsSync(filePath)) {
          console.warn(`  [skip] MapId ${mapId.id}: file not found at ${filePath}`);
          unresolvableIds.push(mapId.id);
          skipped++;
          continue;
        }

        const pixelHash = await imageHash.hashMapIdImage(filePath);
        if (!pixelHash) {
          console.warn(`  [skip] MapId ${mapId.id}: image is not 128x128`);
          unresolvableIds.push(mapId.id);
          skipped++;
          continue;
        }

        await mapIdModel.setPixelHash(mapId.id, pixelHash);
        updated++;
      } catch (error) {
        console.warn(`  [skip] MapId ${mapId.id}: ${error.message}`);
        unresolvableIds.push(mapId.id);
        skipped++;
      }
      processed++;
    }

    console.log(`  ...${processed} MapIds processed (${updated} updated, ${skipped} skipped)`);
  }

  console.log(`Done. MapIds: ${processed} processed, ${updated} updated, ${skipped} skipped.`);
}

// Runs hashMapArtChunks for one MapArt in a fresh child process, so a huge image that gets
// OOM-killed only takes down the worker, not this script. Resolves to { ok: true, result } or
// { ok: false, error } - never rejects, so the caller can treat any failure as a normal skip.
function hashMapArtChunksIsolated(filePath, width, height) {
  return new Promise((resolve) => {
    let settled = false;
    const worker = fork(WORKER_PATH);

    const finish = (value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.removeAllListeners();
      if (worker.exitCode === null && worker.signalCode === null) {
        worker.kill();
      }
      resolve(value);
    };

    const timer = setTimeout(() => {
      finish({ ok: false, error: `worker timed out after ${WORKER_TIMEOUT_MS}ms` });
    }, WORKER_TIMEOUT_MS);

    worker.on('message', (message) => finish(message));
    worker.on('error', (error) => finish({ ok: false, error: error.message }));
    worker.on('exit', (code, signal) => {
      // Reaches here without a prior 'message' if the worker crashed/was killed (e.g. OOM) before
      // it could report a result.
      finish({ ok: false, error: `worker exited unexpectedly (code=${code}, signal=${signal})` });
    });

    worker.send({ filePath, width, height });
  });
}

async function backfillMapArts() {
  console.log('Backfilling MapArt pixelHashes and chunks...');
  let processed = 0;
  let updated = 0;
  let skipped = 0;
  const unresolvableIds = []; // records that will never get a pixelHash this run (bad file/dims/worker failure) - must be excluded or the loop never terminates

  while (true) {
    const batch = await prisma.mapArt.findMany({
      where: {
        ...missingPixelHashFilter,
        ...(unresolvableIds.length ? { id: { notIn: unresolvableIds } } : {}),
      },
      take: BATCH_SIZE,
    });

    if (batch.length === 0) break;

    for (const mapArt of batch) {
      const filePath = path.join(MAPART_DIR, mapArt.imgUrl);
      try {
        if (!fs.existsSync(filePath)) {
          console.warn(`  [skip] MapArt ${mapArt.id}: file not found at ${filePath}`);
          unresolvableIds.push(mapArt.id);
          skipped++;
          continue;
        }

        const outcome = await hashMapArtChunksIsolated(filePath, mapArt.width, mapArt.height);
        if (!outcome.ok) {
          console.warn(`  [skip] MapArt ${mapArt.id}: ${outcome.error}`);
          unresolvableIds.push(mapArt.id);
          skipped++;
          continue;
        }

        const result = outcome.result;
        if (!result) {
          console.warn(`  [skip] MapArt ${mapArt.id}: image dimensions don't match ${mapArt.width}x${mapArt.height} grid`);
          unresolvableIds.push(mapArt.id);
          skipped++;
          continue;
        }

        await mapArtModel.setPixelHash(mapArt.id, result.pixelHash);
        await mapArtModel.replaceMapArtChunks(mapArt.id, mapArt.server, result.chunks);
        updated++;
      } catch (error) {
        console.warn(`  [skip] MapArt ${mapArt.id}: ${error.message}`);
        unresolvableIds.push(mapArt.id);
        skipped++;
      }
      processed++;
    }

    console.log(`  ...${processed} MapArts processed (${updated} updated, ${skipped} skipped)`);
  }

  console.log(`Done. MapArts: ${processed} processed, ${updated} updated, ${skipped} skipped.`);
}

async function main() {
  if (RESET) {
    await resetExistingHashes();
  }
  await backfillMapIds();
  await backfillMapArts();
  await prisma.$disconnect();
}

// Guard against running as a side effect of require() (e.g. from a test harness or another
// script importing this file) - this should only ever execute when run directly.
if (require.main === module) {
  main().catch((error) => {
    console.error('Backfill failed:', error);
    process.exit(1);
  });
}

module.exports = { main };
