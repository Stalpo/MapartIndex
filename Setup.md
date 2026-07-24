### How to get it up and running:
1. Run `npm install` to install the project dependencies
2. Run `npx prisma generate` to generate the prisma client source
3. Run `node --env-file .env index.js` to run the web application

### .env requirements:
```
DATABASE_URL="mongodb+srv://"
SECRET_KEY="secretkey"
DISCORD_CLIENT_ID="clientid"
DISCORD_CLIENT_SECRET="clientsecret"
```

### Useful stuff
- [Prisma](https://www.prisma.io/docs/)
- Push schema changes to the database: `npx prisma db push`
- Live view of the database: `npx prisma studio`

### Setting up MongoDB (Replica Set)
Prisma requires MongoDB to be in replication mode to enable features such as fault tolerance, data redundancy, and high availability through replica sets.

- Stop the mongodb service
- Edit mongod.conf
```
# replica set options
replication:
  replSetName: myReplicaSet
```
- Start mongodb service
- Run the following command in mongosh
```rs.initiate()```
- Check that replication is applied with this command
```rs.status()```

### Scripts (`/scripts`)
One-off maintenance scripts, run manually with `node scripts/<name>.js`. None of these run automatically - they only execute when you invoke them directly.

#### `backfillDuplicateHashes.js`
Populates `MapId.pixelHash`, `MapArt.pixelHash`, and `MapArtChunk` rows used by the duplicate-check feature (the "Duplicate Check" buttons on the MapId/MapArt edit pages). Needed once for any records that existed before that feature was added - new uploads get hashed automatically. Safe to re-run: it only touches records still missing a `pixelHash`.
```
node scripts/backfillDuplicateHashes.js
```
Pass `--reset` to clear all existing `pixelHash`/`MapArtChunk` data before backfilling and recompute everything from scratch. Needed once if the hashing implementation/library ever changes, since hashes from different implementations aren't guaranteed to be byte-identical for the same image:
```
node scripts/backfillDuplicateHashes.js --reset
```
Requires the `sharp` package's native binary for the platform it's running on. If you see `Could not load the "sharp" module using the <platform> runtime`, run `npm install --os=<os> --cpu=<cpu> sharp` on that machine (e.g. `npm install --os=linux --cpu=x64 sharp` on a Linux x64 server) - this usually happens when `node_modules`/the lockfile was generated on a different OS than where it's being run. Also requires Node `>=20.9.0` (see `engines` in `package.json`).

MapArt chunk-hashing runs each MapArt in its own child process (via `backfillMapArtWorker.js` - not meant to be run directly) so that one oversized image getting OOM-killed only skips that record instead of crashing the whole run. Skipped/failed records are logged to the console as the script runs.

#### `duplicateScan.js`
Full-database duplicate check across every server's MapIds and MapArts. It's the bulk counterpart to the "Duplicate Check" buttons on the MapId/MapArt edit pages (`controllers/duplicateCheckController.js`) - instead of checking one record at a time, it loads every MapId/MapArt/MapArtChunk and groups them by `pixelHash`/`hash` directly, so a full scan is a handful of queries instead of one per record. Requires `pixelHash` to already be populated (see `backfillDuplicateHashes.js` above) - it warns and skips any record that's missing one.

Three modes:
```
node scripts/duplicateScan.js            (default) Reports every duplicate found. No writes.
node scripts/duplicateScan.js --fixes    Same report, plus which duplicates match a "safe fix"
                                          case below and what action would be taken. Still no writes.
node scripts/duplicateScan.js --apply    Same as --fixes, but actually performs the safe fixes.
```
Scope flags: `--server=<name>` to scan just one server, `--global` to have the *report* include cross-server matches (the safe-fix cases always stay within a single server regardless of `--global` - see the comment at the top of the script for why).

The safe-fix cases (each independently toggleable via the `CASES_ENABLED` object at the top of the script, and implemented in its own clearly-labeled `// ===== CASE N =====` block so any one of them can be disabled without touching the others):
1. **Link**: an empty MapArt (no MapIds) whose chunk hashes exactly match a set of loose MapIds (no MapArt), with no other candidates in the pool → link them.
2. **Delete**: a loose MapId that's a pixel-duplicate of another MapId which *is* linked to a MapArt → delete the loose one.
3. **Delete**: an empty MapArt that's a pixel-duplicate of another MapArt which *does* have MapIds → delete the empty one.
4. **Delete**: a MapArt with MapIds that's a pixel-duplicate of another MapArt which also has MapIds → keep the oldest, delete the rest (and their MapIds too).
5. *(suggested, off by default)* Two or more empty MapArts that are pixel-duplicates of each other → keep the oldest, delete the rest.
6. *(suggested, off by default)* Two or more loose MapIds that are pixel-duplicates of each other → keep the oldest, delete the rest.

Cases 5 and 6 are safe in the same sense as 1-4 (nothing meaningful is attached on either side), but which record counts as "canonical" is more of a judgment call, so they default to off - flip them on in `CASES_ENABLED` if you want them.

Case 1's linking only fires when the number of available loose MapIds for a given hash *exactly* matches the number of chunks needing it - too few and it can't cover every chunk, too many and it can't tell which candidates actually belong to this MapArt. Either way it skips and logs the MapArt for manual review instead of guessing.

This script never touches image files on disk - a deleted MapArt/MapId row just leaves its file under `public/uploads(/mapart)` orphaned. Run `cleanupOrphanedImages.js` afterwards to reclaim that space.

Every run writes a full report to a timestamped file (`scripts/duplicate-scan-<timestamp>.txt`); the console only prints summary counts.

Since `--apply` writes to the database and deletes files' DB records, take a backup first with `backupData.js` below - especially before running it against production.

#### `backupData.js` / `restoreData.js`
Back up and restore the full application state: the MongoDB database (via `mongodump`/`mongorestore`) and the `public/uploads` image tree (via `tar`), bundled into a single timestamped archive under `backups/` (gitignored). Meant to be run right before anything risky - e.g. `duplicateScan.js --apply` on production - so there's a known-good snapshot to fall back to.

Both require the [MongoDB Database Tools](https://www.mongodb.com/docs/database-tools/installation/) (`mongodump`/`mongorestore`) to be installed - e.g. `sudo apt install mongodb-database-tools` on Debian/Ubuntu. Neither backs up `.env` or other config/secrets - those need to be preserved separately.

Backup:
```
node --env-file .env scripts/backupData.js                  Writes backups/mapart-backup-<timestamp>.tar.gz
node --env-file .env scripts/backupData.js --out=/some/dir  Use a different output directory
```
Each archive contains the raw `mongodump` output, a `tar`'d copy of `public/uploads`, and a `manifest.json` (timestamp, database name/host, git commit, and per-collection record counts) so you can sanity-check what's in it without doing a full restore.

Restore is destructive - it drops and replaces every collection present in the backup, and replaces `public/uploads` - so it defaults to a dry run that just prints the backup's manifest and what it *would* do. Pass `--yes` to actually restore:
```
node --env-file .env scripts/restoreData.js --list                       List available backups
node --env-file .env scripts/restoreData.js <path-to-backup.tar.gz>      Dry run - show what's in it
node --env-file .env scripts/restoreData.js <path-to-backup.tar.gz> --yes    Actually restore
```
The current `public/uploads` folder (if any) is renamed to `public/uploads.pre-restore-<timestamp>` rather than deleted, so a bad restore can still be undone by hand; delete it once you've confirmed things look right. `mongorestore --drop` only touches collections that exist in the dump - anything else in the database is left alone.

Extra flags after a bare `--` are forwarded as-is to the underlying `mongodump`/`mongorestore` call, e.g. `node scripts/backupData.js -- --oplog` or `node scripts/restoreData.js <path> --yes -- --noIndexRestore`.

#### `removeMapIdNsfwField.js`
One-time cleanup for the `MapId.nsfw` -> derived-from-`MapArt` refactor. `MapId` no longer has its own `nsfw` field in `prisma/schema.prisma` - a MapId's nsfw is always read live from its linked MapArt (`withDerivedNsfw` in `models/mapIdModel.js`), controlled by editing the MapArt (mark a MapArt nsfw/not-nsfw and every MapId linked to it picks that up automatically, no sync step involved). Loose MapIds with no MapArt are just never nsfw.

Removing a field from `schema.prisma` only makes Prisma stop reading/writing it - MongoDB is schemaless, so any `nsfw` key already stored on existing `MapId` documents from before this change is left behind as harmless dead data. This script clears it out with a raw `$unset`, purely for tidiness:
```
node --env-file .env scripts/removeMapIdNsfwField.js
```
Safe to re-run - documents that no longer have the field just don't match and are skipped. Run it once after deploying this change and running `npx prisma generate`/`npx prisma db push`.

#### `cleanupOrphanedImages.js`
Deletes image files under `public/uploads/` and `public/uploads/mapart/` that aren't referenced by any `MapId`/`MapArt` record in the DB. Does **not** touch `public/uploads/tmp`, `public/uploads/mapart/tmp`, or `public/uploads/server` - those are upload staging directories that are never DB-referenced by design, so cleaning them up is a separate concern.

Defaults to a dry run - it prints what it would delete and writes the full list to a timestamped report file (`scripts/orphaned-images-<timestamp>.txt`), but deletes nothing:
```
node scripts/cleanupOrphanedImages.js
```
Review the report, then actually delete with:
```
node scripts/cleanupOrphanedImages.js --delete
```
Aborts automatically (no deletions) if fewer than 50% of on-disk files come back as DB-referenced, since that shape of result more likely means a bad DB connection than genuine mass orphaning.
