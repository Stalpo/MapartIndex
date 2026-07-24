// Finds (and optionally deletes) image files under public/uploads/ that aren't referenced by
// any MapId or MapArt record in the DB.
//
// Only touches the two known top-level image directories:
//   public/uploads/*.png        <- MapId.imgUrl
//   public/uploads/mapart/*.png <- MapArt.imgUrl
// It does NOT touch public/uploads/tmp, public/uploads/mapart/tmp, or public/uploads/server(/tmp).
// Those are multer staging dirs that are never referenced by any DB record by design (files land
// there mid-upload and get renamed out on success) - "not in the DB" is trivially true for
// everything in them, so the orphan-vs-DB logic in this script doesn't apply there. They're full
// of debris from failed/incomplete uploads, but cleaning that up is a separate, age-based problem,
// not a DB-reconciliation one.
//
// Defaults to a dry run: it reports what it *would* delete and writes the full list to a report
// file, but doesn't touch anything on disk unless you pass --delete.
//
// Usage:
//   node scripts/cleanupOrphanedImages.js              (dry run, writes a report)
//   node scripts/cleanupOrphanedImages.js --delete      (actually deletes the orphaned files)
const path = require('path');
const fs = require('fs');

const { prisma } = require('../util/db');

const ROOT = path.resolve(__dirname, '..');
const MAPID_DIR = path.join(ROOT, 'public', 'uploads');
const MAPART_DIR = path.join(ROOT, 'public', 'uploads', 'mapart');

const DELETE = process.argv.includes('--delete');

// If the DB comes back with suspiciously few referenced filenames compared to what's on disk,
// abort instead of treating nearly everything as "orphaned" - that shape of result is far more
// likely to mean something's wrong with the DB connection/query than that thousands of images
// were genuinely abandoned.
const SANITY_MIN_REFERENCED_RATIO = 0.5;

const listImageFiles = (dir) => {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith('.')); // skip .placeholder and any other dotfiles
};

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const reconcile = async (label, dir, referencedNames) => {
  const referenced = new Set(referencedNames);
  const filesOnDisk = listImageFiles(dir);

  if (filesOnDisk.length > 0) {
    const referencedRatio = referenced.size / filesOnDisk.length;
    if (referencedRatio < SANITY_MIN_REFERENCED_RATIO) {
      throw new Error(
        `${label}: only ${referenced.size} of ${filesOnDisk.length} files on disk are referenced in the DB ` +
        `(${(referencedRatio * 100).toFixed(1)}%). That's below the ${SANITY_MIN_REFERENCED_RATIO * 100}% sanity ` +
        `threshold - aborting rather than risk deleting files because of a bad DB query/connection. ` +
        `If this ratio is genuinely correct, raise SANITY_MIN_REFERENCED_RATIO and re-run.`
      );
    }
  }

  const orphaned = [];
  let orphanedBytes = 0;
  for (const name of filesOnDisk) {
    if (!referenced.has(name)) {
      const filePath = path.join(dir, name);
      const size = fs.statSync(filePath).size;
      orphaned.push({ name, filePath, size });
      orphanedBytes += size;
    }
  }

  console.log(`${label}: ${filesOnDisk.length} files on disk, ${referenced.size} referenced in DB, ${orphaned.length} orphaned (${formatBytes(orphanedBytes)})`);

  return orphaned;
};

const writeReport = (allOrphaned) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(__dirname, `orphaned-images-${timestamp}.txt`);
  const lines = allOrphaned.map((entry) => `${entry.filePath}\t${entry.size} bytes`);
  fs.writeFileSync(reportPath, lines.join('\n') + '\n');
  return reportPath;
};

async function main() {
  console.log(DELETE ? 'Running in DELETE mode - orphaned files will be removed.' : 'Running in dry-run mode (default) - pass --delete to actually remove files.');
  console.log('');

  const [mapIds, mapArts] = await Promise.all([
    prisma.mapId.findMany({ select: { imgUrl: true } }),
    prisma.mapArt.findMany({ select: { imgUrl: true } }),
  ]);

  const mapIdOrphans = await reconcile('MapId images (public/uploads)', MAPID_DIR, mapIds.map((m) => m.imgUrl));
  const mapArtOrphans = await reconcile('MapArt images (public/uploads/mapart)', MAPART_DIR, mapArts.map((m) => m.imgUrl));

  const allOrphaned = [...mapIdOrphans, ...mapArtOrphans];
  const totalBytes = allOrphaned.reduce((sum, entry) => sum + entry.size, 0);

  console.log('');
  console.log(`Total orphaned: ${allOrphaned.length} files, ${formatBytes(totalBytes)}`);

  if (allOrphaned.length === 0) {
    console.log('Nothing to do.');
    await prisma.$disconnect();
    return;
  }

  const reportPath = writeReport(allOrphaned);
  console.log(`Full list written to: ${reportPath}`);

  if (DELETE) {
    let deleted = 0;
    let failed = 0;
    for (const entry of allOrphaned) {
      try {
        fs.unlinkSync(entry.filePath);
        deleted++;
      } catch (error) {
        console.warn(`  [failed] ${entry.filePath}: ${error.message}`);
        failed++;
      }
    }
    console.log(`Deleted ${deleted} files${failed ? `, ${failed} failed` : ''}, freed ${formatBytes(totalBytes)}.`);
  } else {
    console.log('Dry run only - no files were deleted. Re-run with --delete to remove them.');
  }

  await prisma.$disconnect();
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Cleanup failed:', error);
    process.exit(1);
  });
}

module.exports = { main };
