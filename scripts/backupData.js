// Backs up the full application state - the MongoDB database (via mongodump) and the
// public/uploads image tree (via tar) - into a single timestamped archive under backups/.
//
// Meant to be run right before anything risky (e.g. `duplicateScan.js --apply`), so there's a
// known-good snapshot to restore from with restoreData.js if something goes wrong.
//
// Requires the MongoDB Database Tools (`mongodump`) to be installed:
//   Debian/Ubuntu: sudo apt install mongodb-database-tools
//   Other platforms: https://www.mongodb.com/docs/database-tools/installation/
//
// Usage:
//   node --env-file .env scripts/backupData.js
//   node --env-file .env scripts/backupData.js --out=/some/other/dir   (default: ./backups)
//   node --env-file .env scripts/backupData.js -- --oplog             (extra args after `--`
//     are forwarded to mongodump as-is, e.g. for --oplog or auth options)
//
// Does NOT back up .env or any other config/secrets - those need to be preserved separately.
const path = require('path');
const fs = require('fs');
const { spawn, execSync } = require('child_process');

const { prisma } = require('../util/db');

const ROOT = path.resolve(__dirname, '..');
const UPLOADS_DIR = path.join(ROOT, 'public', 'uploads');
const DEFAULT_BACKUPS_DIR = path.join(ROOT, 'backups');

const outArg = process.argv.find((a) => a.startsWith('--out='));
const OUT_DIR = outArg ? path.resolve(outArg.slice('--out='.length)) : DEFAULT_BACKUPS_DIR;

const dashDashIndex = process.argv.indexOf('--');
const EXTRA_MONGODUMP_ARGS = dashDashIndex === -1 ? [] : process.argv.slice(dashDashIndex + 1);

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
};

// mongodb:// and mongodb+srv:// URIs parse fine with the WHATWG URL class since they have a
// "//" authority section - wrapped in try/catch since this is purely informational (printed so
// whoever runs this can double check they're pointed at the database they think they are).
const describeConnection = (uri) => {
  try {
    const parsed = new URL(uri);
    const dbName = parsed.pathname.replace(/^\//, '') || '(default)';
    return { dbName, host: parsed.host };
  } catch {
    return { dbName: '(unknown - could not parse DATABASE_URL)', host: '(unknown)' };
  }
};

const getGitCommit = () => {
  try {
    return execSync('git rev-parse --short HEAD', { cwd: ROOT }).toString().trim();
  } catch {
    return null;
  }
};

const getCounts = async () => ({
  user: await prisma.user.count(),
  profile: await prisma.profile.count(),
  server: await prisma.server.count(),
  mapArt: await prisma.mapArt.count(),
  mapId: await prisma.mapId.count(),
  mapArtChunk: await prisma.mapArtChunk.count(),
});

const run = (cmd, args, { installHint } = {}) => {
  console.log(`  $ ${cmd} ${args.join(' ')}`);
  return new Promise((resolve, reject) => {
    // shell:true only on Windows - that's a plain compatibility fix so `spawn` can find .cmd/.bat
    // shims (e.g. mongodump installed via a package manager that only puts a .cmd on PATH), since
    // Windows doesn't otherwise apply PATHEXT resolution to spawn's bare command name. Left off on
    // POSIX/production so command args are never passed through a shell.
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

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set - run this with `node --env-file .env scripts/backupData.js`');
  }

  const { dbName, host } = describeConnection(process.env.DATABASE_URL);
  console.log(`Backing up database "${dbName}" on ${host}`);
  console.log(`Backing up files under ${UPLOADS_DIR}`);
  console.log('');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const workDirName = `.tmp-backup-${timestamp}`;
  const workDir = path.join(OUT_DIR, workDirName);
  fs.mkdirSync(workDir, { recursive: true });

  try {
    console.log('Running mongodump...');
    await run(
      'mongodump',
      ['--uri', process.env.DATABASE_URL, '--out', path.join(workDir, 'db'), ...EXTRA_MONGODUMP_ARGS],
      { installHint: 'Install the MongoDB Database Tools - see https://www.mongodb.com/docs/database-tools/installation/' }
    );

    if (fs.existsSync(UPLOADS_DIR)) {
      console.log('Archiving public/uploads...');
      await run('tar', ['-czf', path.join(workDir, 'uploads.tar.gz'), '-C', path.join(UPLOADS_DIR, '..'), 'uploads']);
    } else {
      console.warn(`Warning: ${UPLOADS_DIR} doesn't exist - skipping file backup.`);
    }

    console.log('Recording collection counts...');
    const counts = await getCounts();

    const manifest = {
      createdAt: new Date().toISOString(),
      databaseName: dbName,
      databaseHost: host,
      gitCommit: getGitCommit(),
      counts,
    };
    fs.writeFileSync(path.join(workDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

    const archivePath = path.join(OUT_DIR, `mapart-backup-${timestamp}.tar.gz`);
    console.log('Compressing final archive...');
    await run('tar', ['-czf', archivePath, '-C', OUT_DIR, workDirName]);

    const sizeBytes = fs.statSync(archivePath).size;
    console.log('');
    console.log(`Backup complete: ${archivePath} (${formatBytes(sizeBytes)})`);
    console.log(`Manifest: ${JSON.stringify(manifest)}`);
    console.log('');
    console.log(`Restore this with: node --env-file .env scripts/restoreData.js ${archivePath} --yes`);
  } finally {
    fs.rmSync(workDir, { recursive: true, force: true });
  }

  await prisma.$disconnect();
}

if (require.main === module) {
  main().catch(async (error) => {
    console.error('Backup failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
}

module.exports = { main };
