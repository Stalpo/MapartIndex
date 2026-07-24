// One-time cleanup after the MapId.nsfw -> derived-from-MapArt refactor.
//
// MapId.nsfw used to be its own independently-editable field. It's now removed from
// prisma/schema.prisma - a MapId's nsfw is always read live from its linked MapArt (see
// withDerivedNsfw in models/mapIdModel.js), so there's nothing to keep in sync and nothing a
// backfill script needs to fix going forward.
//
// Removing a field from schema.prisma just makes Prisma stop reading/writing it - MongoDB is
// schemaless, so any `nsfw` key already stored on existing MapId documents is left behind as
// harmless dead data. This script clears it out with a raw $unset, purely for tidiness (so
// `mongosh`/Compass/backups don't show a stray, unused, possibly-stale `nsfw` field next to the
// real source of truth on MapArt).
//
// Safe to run multiple times - documents that no longer have the field just don't match the
// query and are left alone. Run this AFTER deploying the schema/code changes and running
// `npx prisma generate` (and `npx prisma db push`).
//
// Usage:
//   node --env-file .env scripts/removeMapIdNsfwField.js
const { prisma } = require('../util/db');

async function main() {
  const before = await prisma.$runCommandRaw({
    count: 'MapId',
    query: { nsfw: { $exists: true } },
  });
  const staleCount = before.n || 0;

  console.log(`${staleCount} MapId document(s) still have a stored nsfw field.`);
  if (staleCount === 0) {
    console.log('Nothing to do.');
    await prisma.$disconnect();
    return;
  }

  const result = await prisma.$runCommandRaw({
    update: 'MapId',
    updates: [
      { q: { nsfw: { $exists: true } }, u: { $unset: { nsfw: '' } }, multi: true },
    ],
  });

  console.log(`Unset nsfw on ${result.nModified ?? result.n} MapId document(s).`);
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
