// One-time cleanup after removing MapId.artist (artist now only lives on MapArt).
//
// MapId used to have its own independently-editable `artist` field. It's now removed from
// prisma/schema.prisma - artist is a MapArt-only concept, and a MapId has no artist of its own
// (browse/search/sort no longer reference it for MapId).
//
// Removing a field from schema.prisma just makes Prisma stop reading/writing it - MongoDB is
// schemaless, so any `artist` key already stored on existing MapId documents is left behind as
// harmless dead data. This script clears it out with a raw $unset, purely for tidiness (so
// `mongosh`/Compass/backups don't show a stray, unused, possibly-stale `artist` field on MapId
// documents).
//
// Safe to run multiple times - documents that no longer have the field just don't match the
// query and are left alone. Run this AFTER deploying the schema/code changes and running
// `npx prisma generate` (and `npx prisma db push`).
//
// Usage:
//   node --env-file .env scripts/removeMapIdArtistField.js
const { prisma } = require('../util/db');

async function main() {
  const before = await prisma.$runCommandRaw({
    count: 'MapId',
    query: { artist: { $exists: true } },
  });
  const staleCount = before.n || 0;

  console.log(`${staleCount} MapId document(s) still have a stored artist field.`);
  if (staleCount === 0) {
    console.log('Nothing to do.');
    await prisma.$disconnect();
    return;
  }

  const result = await prisma.$runCommandRaw({
    update: 'MapId',
    updates: [
      { q: { artist: { $exists: true } }, u: { $unset: { artist: '' } }, multi: true },
    ],
  });

  console.log(`Unset artist on ${result.nModified ?? result.n} MapId document(s).`);
  await prisma.$disconnect();
}

if (require.main === module) {
  main().catch(async (error) => {
    console.error('Cleanup failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
}

module.exports = { main };
