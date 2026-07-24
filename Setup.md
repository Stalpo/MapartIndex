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
