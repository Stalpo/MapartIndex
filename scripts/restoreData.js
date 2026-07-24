// Restores a backup created by backupData.js: the MongoDB database (via mongorestore --drop)
// and the public/uploads image tree. Destructive - it replaces collections that exist in the
// backup and replaces public/uploads wholesale - so it defaults to a dry run that just shows
// what's in the backup and what it *would* do. Pass --yes to actually perform the restore.
//
// Requires the MongoDB Database Tools (`mongorestore`) to be installed - same package as
// mongodump, see backupData.js.
//
// Usage:
//   node --env-file .env scripts/restoreData.js --list                    List available backups.
//   node --env-file .env scripts/restoreData.js <path-to-backup.tar.gz>   Dry run - show what
//                                                                          this backup contains.
//   node --env-file .env scripts/restoreData.js <path-to-backup.tar.gz> --yes
//                                                                          Actually restore.
//   node --env-file .env scripts/restoreData.js <path> --yes -- --noIndexRestore
//                                                                          Extra args after `--`
//                                                                          are forwarded to
//                                                                          mongorestore as-is.
//
// The existing public/uploads folder (if any) is renamed aside (public/uploads.pre-restore-<ts>)
// rather than deleted, so a bad restore can still be undone by hand. mongorestore --drop only
// touches collections present in the dump - anything else in the database is left alone.
const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawn } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const UPLOADS_DIR = path.join(ROOT, 'public', 'uploads');
const DEFAULT_BACKUPS_DIR = path.join(ROOT, 'backups');

const LIST = process.argv.includes('--list');
const YES = process.argv.includes('--yes');
const dirArg = process.argv.find((a) => a.startsWith('--dir='));
const BACKUPS_DIR = dirArg ? path.resolve(dirArg.slice('--dir='.length)) : DEFAULT_BACKUPS_DIR;

const dashDashIndex = process.argv.indexOf('--');
const EXTRA_MONGORESTORE_ARGS = dashDashIndex === -1 ? [] : process.argv.slice(dashDashIndex + 1);

// The positional argument is whatever isn't a flag and isn't part of the `-- <extra args>` tail.
const argsBeforeDashDash = dashDashIndex === -1 ? process.argv.slice(2) : process.argv.slice(2, dashDashIndex);
const BACKUP_PATH_ARG = argsBeforeDashDash.find((a) => !a.startsWith('--'));

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
};

const describeConnection = (uri) => {
  try {
    const parsed = new URL(uri);
    const dbName = parsed.pathname.replace(/^\//, '') || '(default)';
    return { dbName, host: parsed.host };
  } catch {
    return { dbName: '(unknown - could not parse DATABASE_URL)', host: '(unknown)' };
  }
};

const run = (cmd, args, { installHint } = {}) => {
  console.log(`  $ ${cmd} ${args.join(' ')}`);
  return new Promise((resolve, reject) => {
    // shell:true only on Windows - see the matching comment in backupData.js.
    const child = spawn(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' });
    child.on('error', (error) => {
      if (error.code === 'ENOENT') {
        reject(new Error(`${cmd} not found on PATH.${installHint ? ` ${installHint}` : ''}`));
      } else {
        reject(error);
      }
    });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited with code ${code}`));
    });
  });
};

function listBackups() {
  if (!fs.existsSync(BACKUPS_DIR)) {
    console.log(`No backups directory at ${BACKUPS_DIR}.`);
    return;
  }
  const entries = fs.readdirSync(BACKUPS_DIR)
    .filter((name) => name.endsWith('.tar.gz'))
    .map((name) => {
      const fullPath = path.join(BACKUPS_DIR, name);
      const stat = fs.statSync(fullPath);
      return { name, fullPath, size: stat.size, mtime: stat.mtime };
    })
    .sort((a, b) => b.mtime - a.mtime);

  if (entries.length === 0) {
    console.log(`No backups found in ${BACKUPS_DIR}.`);
    return;
  }

  console.log(`Backups in ${BACKUPS_DIR} (newest first):`);
  for (const entry of entries) {
    console.log(`  ${entry.mtime.toISOString()}  ${formatBytes(entry.size).padStart(9)}  ${entry.fullPath}`);
  }
}

async function main() {
  if (LIST) {
    listBackups();
    return;
  }

  if (!BACKUP_PATH_ARG) {
    console.error('Usage: node scripts/restoreData.js <path-to-backup.tar.gz> [--yes] [-- <extra mongorestore args>]');
    console.error('       node scripts/restoreData.js --list');
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set - run this with `node --env-file .env scripts/restoreData.js ...`');
  }

  const archivePath = path.resolve(BACKUP_PATH_ARG);
  if (!fs.existsSync(archivePath)) {
    throw new Error(`Backup archive not found: ${archivePath}`);
  }

  const extractDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mapart-restore-'));
  console.log(`Extracting ${archivePath}...`);
  await run('tar', ['-xzf', archivePath, '-C', extractDir]);

  const innerName = fs.readdirSync(extractDir).find((name) => fs.statSync(path.join(extractDir, name)).isDirectory());
  if (!innerName) throw new Error(`Backup archive didn't contain the expected folder structure: ${archivePath}`);
  const innerDir = path.join(extractDir, innerName);

  const manifestPath = path.join(innerDir, 'manifest.json');
  const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : null;

  console.log('');
  console.log('This backup contains:');
  console.log(manifest ? JSON.stringify(manifest, null, 2) : '  (no manifest.json found - backup may be from an older/different tool)');

  const { dbName, host } = describeConnection(process.env.DATABASE_URL);
  console.log('');
  console.log(`Restoring will DROP AND REPLACE the collections present in this backup in database "${dbName}" on ${host},`);
  console.log(`and REPLACE ${UPLOADS_DIR} on this machine (the current folder is renamed aside, not deleted).`);

  if (!YES) {
    console.log('');
    console.log('Dry run only - no changes made. Re-run with --yes to actually restore.');
    fs.rmSync(extractDir, { recursive: true, force: true });
    return;
  }

  console.log('');
  console.log('Restoring database (mongorestore --drop)...');
  await run(
    'mongorestore',
    ['--uri', process.env.DATABASE_URL, '--drop', path.join(innerDir, 'db'), ...EXTRA_MONGORESTORE_ARGS],
    { installHint: 'Install the MongoDB Database Tools - see https://www.mongodb.com/docs/database-tools/installation/' }
  );

  const uploadsTar = path.join(innerDir, 'uploads.tar.gz');
  if (fs.existsSync(uploadsTar)) {
    console.log('Restoring public/uploads...');
    if (fs.existsSync(UPLOADS_DIR)) {
      const movedAside = `${UPLOADS_DIR}.pre-restore-${Date.now()}`;
      fs.renameSync(UPLOADS_DIR, movedAside);
      console.log(`  Previous uploads folder preserved at ${movedAside} - delete it by hand once you've confirmed the restore.`);
    }
    fs.mkdirSync(path.join(ROOT, 'public'), { recursive: true });
    await run('tar', ['-xzf', uploadsTar, '-C', path.join(ROOT, 'public')]);
  } else {
    console.log('No uploads.tar.gz in this backup - skipping file restore.');
  }

  fs.rmSync(extractDir, { recursive: true, force: true });
  console.log('');
  console.log('Restore complete.');
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Restore failed:', error);
    process.exit(1);
  });
}

module.exports = { main };
