// One-off backfill for the duplicate-check system.
//
// Populates MapId.pixelHash, MapArt.pixelHash, and MapArtChunk rows for
// records that predate the duplicate-check feature. Safe to re-run: it only
// touches records that are missing a pixelHash.
//
// Usage: node scripts/backfillDuplicateHashes.js
const path = require('path');
const fs = require('fs');

const { prisma } = require('../util/db');
const imageHash = require('../util/imageHash');
const mapIdModel = require('../models/mapIdModel');
const mapArtModel = require('../models/mapArtModel');

const ROOT = path.resolve(__dirname, '..');
const MAPID_DIR = path.join(ROOT, 'public', 'uploads');
const MAPART_DIR = path.join(ROOT, 'public', 'uploads', 'mapart');
const BATCH_SIZE = 200;

const missingPixelHashFilter = {
  OR: [
    { pixelHash: null },
    { pixelHash: { isSet: false } },
  ],
};

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

async function backfillMapArts() {
  console.log('Backfilling MapArt pixelHashes and chunks...');
  let processed = 0;
  let updated = 0;
  let skipped = 0;
  const unresolvableIds = []; // records that will never get a pixelHash this run (bad file/dims) - must be excluded or the loop never terminates

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

        const result = await imageHash.hashMapArtChunks(filePath, mapArt.width, mapArt.height);
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
  await backfillMapIds();
  await backfillMapArts();
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Backfill failed:', error);
  process.exit(1);
});
