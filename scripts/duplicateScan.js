// Full-database duplicate check scan across every server's MapIds and MapArts.
//
// This is the bulk/offline counterpart to the "Duplicate Check" buttons on the MapId/MapArt edit
// pages (controllers/duplicateCheckController.js). Instead of checking one record at a time via
// the API, it loads every MapId, MapArt, and MapArtChunk into memory and groups them by
// pixelHash/hash directly, so a full scan is a handful of queries instead of one query per record.
//
// Three modes:
//   node scripts/duplicateScan.js              Report every duplicate found. No classification,
//                                               no writes. This is the default - safe to run any time.
//   node scripts/duplicateScan.js --fixes       Same report, plus a section classifying which
//                                               duplicates match one of the "safe fix" cases below
//                                               and what action WOULD be taken. Still no writes.
//   node scripts/duplicateScan.js --apply       Same as --fixes, but actually performs the safe
//                                               fixes and reports what it did.
//
// Scope flags (apply to the reporting section only - see "Server boundaries" below):
//   --server=<name>   Only scan this server.
//   --global          Report cross-server matches too, instead of scoping matches to each
//                      record's own server.
//
// Server boundaries
// -----------------
// A MapId/MapArt's `server` field is meaningful data (which Minecraft server the map item
// physically exists on), not just a filter. --global affects the REPORT only, so you can spot
// things like the same art accidentally uploaded under two different server names. The safe-fix
// cases (1-4, and the suggested 5/6) always operate within a single server's records, even when
// --global is passed, since linking or deleting across servers would never be correct.
//
// The safe-fix cases
// -------------------
// Each case is independently toggleable via CASES_ENABLED below, and each is implemented in its
// own clearly-labeled block so you can flip a case off (or comment out its block) if you change
// your mind about it. Cases 1-4 are the ones requested; 5 and 6 are suggested extensions of the
// same logic, off by default since they're a judgment call rather than a strict requirement:
//
//   CASE 1 - link:   An empty MapArt (no MapIds) whose chunk hashes exactly match a set of loose
//                     MapIds (no MapArt) with no other candidates in the pool -> link them.
//   CASE 2 - delete:  A loose MapId (no MapArt) that's a pixel-duplicate of another MapId which
//                     IS linked to a MapArt -> delete the loose one.
//   CASE 3 - delete:  An empty MapArt (no MapIds) that's a pixel-duplicate of another MapArt
//                     which DOES have MapIds -> delete the empty one.
//   CASE 4 - delete:  A MapArt with MapIds that's a pixel-duplicate of another MapArt which also
//                     has MapIds -> keep the oldest, delete the rest (and THEIR MapIds too).
//   CASE 5 - delete (suggested, off by default): Two or more empty MapArts (no MapIds on either
//                     side) that are pixel-duplicates of each other -> keep the oldest, delete
//                     the rest. Safe because neither side has anything attached, but it's a
//                     judgment call about which is "canonical" so it defaults to off.
//   CASE 6 - delete (suggested, off by default): Two or more loose MapIds (no MapArt on either
//                     side) that are pixel-duplicates of each other -> keep the oldest, delete
//                     the rest. Same reasoning as case 5.
//
// This script never deletes image files - deleting a MapArt/MapId row here just leaves its
// public/uploads(/mapart) file orphaned. Run scripts/cleanupOrphanedImages.js afterwards to
// reclaim that disk space.
const path = require('path');
const fs = require('fs');

const { prisma } = require('../util/db');
const mapIdModel = require('../models/mapIdModel');

// ── Which safe-fix cases are active in --fixes/--apply. Flip any of these to false (or comment
// out its block further down) to opt out of that case without touching the others. ──
const CASES_ENABLED = {
  case1_linkOrphanChunksToEmptyMapArt: true,
  case2_deleteLooseDuplicateMapId: false,
  case3_deleteEmptyDuplicateMapArt: true,
  case4_deleteDuplicateMapArtWithMapIds: true,
  case5_deleteAllEmptyDuplicateMapArts_suggested: false,
  case6_deleteAllLooseDuplicateMapIds_suggested: false,
};

const GLOBAL = process.argv.includes('--global');
const APPLY = process.argv.includes('--apply');
const SHOW_FIXES = process.argv.includes('--fixes') || APPLY;
const serverArg = process.argv.find((a) => a.startsWith('--server='));
const SERVER_FILTER = serverArg ? serverArg.slice('--server='.length) : null;

const NO_SERVER_KEY = '(no server)';
const GLOBAL_KEY = '(global)';

const groupBy = (records, keyFn) => {
  const map = new Map();
  for (const record of records) {
    const key = keyFn(record);
    if (key === null || key === undefined) continue;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(record);
  }
  return map;
};

const byCreatedAtAsc = (a, b) => a.createdAt.getTime() - b.createdAt.getTime();

// `target.push(...source)` blows the call stack once `source` gets into the tens of thousands of
// entries (V8 caps how many arguments a single call can take) - which a full-DB duplicate report
// can easily reach. A plain loop has no such limit.
const pushAll = (target, source) => {
  for (const item of source) target.push(item);
};

// Splits a full record set into buckets. `global: true` puts everything in one bucket (used for
// the report, when --global is passed). `global: false` buckets by each record's own `server`
// field (used for the report by default, and ALWAYS used for safe-fix classification).
const bucketByServer = (records, global) => {
  if (global) return new Map([[GLOBAL_KEY, records]]);
  return groupBy(records, (r) => r.server || NO_SERVER_KEY);
};

const describeMapId = (m) => `MapId ${m.id} [${m.server || 'no server'}] "${m.displayName || m.imgUrl}"${m.mapId ? ` (linked to MapArt ${m.mapId})` : ' (loose)'}`;
const describeMapArt = (a, mapIdCount) => `MapArt ${a.id} [${a.server || 'no server'}] "${a.displayName || a.name || a.imgUrl}" (${mapIdCount} MapId${mapIdCount === 1 ? '' : 's'})`;

async function loadData() {
  const [mapIds, mapArts, chunks] = await Promise.all([
    prisma.mapId.findMany({
      select: { id: true, pixelHash: true, mapId: true, server: true, displayName: true, imgUrl: true, createdAt: true },
    }),
    prisma.mapArt.findMany({
      select: { id: true, pixelHash: true, server: true, displayName: true, name: true, imgUrl: true, createdAt: true },
    }),
    prisma.mapArtChunk.findMany({
      select: { id: true, mapArtId: true, hash: true, x: true, y: true, server: true },
    }),
  ]);

  const filteredMapIds = SERVER_FILTER ? mapIds.filter((m) => m.server === SERVER_FILTER) : mapIds;
  const filteredMapArts = SERVER_FILTER ? mapArts.filter((a) => a.server === SERVER_FILTER) : mapArts;
  const filteredChunks = SERVER_FILTER ? chunks.filter((c) => c.server === SERVER_FILTER) : chunks;

  // Linked-MapId counts per MapArt, computed from the full (unfiltered by pixelHash) MapId list
  // so a MapArt whose only MapId hasn't been pixel-hashed yet still correctly counts as "not empty".
  const mapIdCountByMapArtId = new Map();
  for (const m of mapIds) {
    if (!m.mapId) continue;
    mapIdCountByMapArtId.set(m.mapId, (mapIdCountByMapArtId.get(m.mapId) || 0) + 1);
  }

  return { mapIds: filteredMapIds, mapArts: filteredMapArts, chunks: filteredChunks, mapIdCountByMapArtId };
}

// ─────────────────────────────── raw duplicate report ───────────────────────────────

function buildRawReportForBucket(bucketLabel, mapIds, mapArts, chunks, mapIdCountByMapArtId, lines) {
  lines.push(`\n=== Server: ${bucketLabel} ===`);

  const mapIdGroups = [...groupBy(mapIds, (m) => m.pixelHash).values()].filter((g) => g.length > 1);
  const mapArtGroups = [...groupBy(mapArts, (a) => a.pixelHash).values()].filter((g) => g.length > 1);

  lines.push(`-- MapId vs MapId duplicates: ${mapIdGroups.length} group(s) --`);
  for (const group of mapIdGroups) {
    lines.push(`  pixelHash ${group[0].pixelHash} (${group.length} matches):`);
    for (const m of group) lines.push(`    - ${describeMapId(m)}`);
  }

  lines.push(`-- MapArt vs MapArt duplicates: ${mapArtGroups.length} group(s) --`);
  for (const group of mapArtGroups) {
    lines.push(`  pixelHash ${group[0].pixelHash} (${group.length} matches):`);
    for (const a of group) lines.push(`    - ${describeMapArt(a, mapIdCountByMapArtId.get(a.id) || 0)}`);
  }

  // Chunk-level cross duplicates: any MapId whose pixelHash matches a 128x128 chunk of a MapArt
  // it isn't officially linked to (mirrors checkMapArtVsMapIdChunks, but for every MapArt at once).
  const mapIdsByHash = groupBy(mapIds, (m) => m.pixelHash);
  const chunksByMapArtId = groupBy(chunks, (c) => c.mapArtId);
  let chunkMatchCount = 0;
  const chunkLines = [];
  for (const mapArt of mapArts) {
    const artChunks = chunksByMapArtId.get(mapArt.id) || [];
    const matchesForThisArt = [];
    for (const chunk of artChunks) {
      const candidates = mapIdsByHash.get(chunk.hash) || [];
      for (const mapId of candidates) {
        if (mapId.mapId === mapArt.id) continue; // already officially linked here, not a duplicate
        matchesForThisArt.push({ chunk, mapId });
      }
    }
    if (matchesForThisArt.length > 0) {
      chunkMatchCount++;
      chunkLines.push(`  ${describeMapArt(mapArt, mapIdCountByMapArtId.get(mapArt.id) || 0)}:`);
      for (const { chunk, mapId } of matchesForThisArt) {
        chunkLines.push(`    - chunk (${chunk.x}, ${chunk.y}) matches ${describeMapId(mapId)}`);
      }
    }
  }
  lines.push(`-- MapArt chunk vs MapId duplicates: ${chunkMatchCount} MapArt(s) with a matching loose/foreign MapId --`);
  pushAll(lines, chunkLines);

  return { mapIdGroups, mapArtGroups };
}

// ─────────────────────────────── safe-fix classification ───────────────────────────────

function classifyBucket(mapIds, mapArts, chunks, mapIdCountByMapArtId, mapIdGroups, mapArtGroups) {
  const actions = { case1: [], case2: [], case3: [], case4: [], case5: [], case6: [], skippedAmbiguous: [] };

  // ===== CASE 2: loose MapId duplicates a linked MapId -> delete the loose one =====
  // ===== CASE 6 (suggested, off by default): all-loose MapId duplicate group -> keep oldest =====
  for (const group of mapIdGroups) {
    const linked = group.filter((m) => m.mapId);
    const loose = group.filter((m) => !m.mapId);

    if (CASES_ENABLED.case2_deleteLooseDuplicateMapId && linked.length > 0 && loose.length > 0) {
      for (const m of loose) actions.case2.push({ mapId: m, keptExampleId: linked[0].id });
    } else if (CASES_ENABLED.case6_deleteAllLooseDuplicateMapIds_suggested && linked.length === 0 && loose.length > 1) {
      const sorted = [...loose].sort(byCreatedAtAsc);
      const [keep, ...rest] = sorted;
      for (const m of rest) actions.case6.push({ mapId: m, keptId: keep.id });
    }
  }

  // ===== CASE 3: empty MapArt duplicates a populated MapArt -> delete the empty one =====
  // ===== CASE 4: populated MapArt duplicates another populated MapArt -> keep oldest, delete rest (+ their MapIds) =====
  // ===== CASE 5 (suggested, off by default): all-empty MapArt duplicate group -> keep oldest =====
  for (const group of mapArtGroups) {
    const withIds = group.filter((a) => (mapIdCountByMapArtId.get(a.id) || 0) > 0).sort(byCreatedAtAsc);
    const withoutIds = group.filter((a) => (mapIdCountByMapArtId.get(a.id) || 0) === 0);

    if (CASES_ENABLED.case3_deleteEmptyDuplicateMapArt && withIds.length > 0) {
      for (const a of withoutIds) actions.case3.push({ mapArt: a, keptExampleId: withIds[0].id });
    } else if (CASES_ENABLED.case5_deleteAllEmptyDuplicateMapArts_suggested && withIds.length === 0 && withoutIds.length > 1) {
      const sorted = [...withoutIds].sort(byCreatedAtAsc);
      const [keep, ...rest] = sorted;
      for (const a of rest) actions.case5.push({ mapArt: a, keptId: keep.id });
    }

    if (CASES_ENABLED.case4_deleteDuplicateMapArtWithMapIds && withIds.length > 1) {
      const [keep, ...rest] = withIds;
      for (const a of rest) {
        actions.case4.push({ mapArt: a, keptId: keep.id, mapIdCount: mapIdCountByMapArtId.get(a.id) || 0 });
      }
    }
  }

  // ===== CASE 1: empty MapArt's chunks exactly match a pool of loose MapIds -> link them =====
  if (CASES_ENABLED.case1_linkOrphanChunksToEmptyMapArt) {
    // Loose MapIds already slated for deletion by case 2/6 aren't eligible candidates - they're
    // redundant re-uploads of something that already exists elsewhere, not "the" missing piece.
    const reservedForDeletion = new Set([...actions.case2, ...actions.case6].map((a) => a.mapId.id));
    const poolByHash = groupBy(
      mapIds.filter((m) => !m.mapId && !reservedForDeletion.has(m.id)),
      (m) => m.pixelHash
    );
    const chunksByMapArtId = groupBy(chunks, (c) => c.mapArtId);

    const emptyMapArts = mapArts
      .filter((a) => (mapIdCountByMapArtId.get(a.id) || 0) === 0)
      .sort(byCreatedAtAsc);

    for (const mapArt of emptyMapArts) {
      const artChunks = chunksByMapArtId.get(mapArt.id) || [];
      if (artChunks.length === 0) continue; // not chunk-hashed yet (needs backfillDuplicateHashes.js)

      const neededByHash = groupBy(artChunks, (c) => c.hash);

      // Require an EXACT count match per hash - not "enough" candidates, but exactly the right
      // number. Too few means we can't cover every chunk; too many means we can't tell which
      // candidates actually belong to this MapArt vs. some unrelated stray duplicate. Either way,
      // ambiguous -> skip and leave it for manual review rather than guessing.
      let ambiguous = false;
      for (const [hash, chunkList] of neededByHash) {
        const pool = poolByHash.get(hash) || [];
        if (pool.length !== chunkList.length) {
          ambiguous = true;
          break;
        }
      }
      if (ambiguous) {
        actions.skippedAmbiguous.push({ mapArt });
        continue;
      }

      const mapIdIds = [];
      for (const [hash, chunkList] of neededByHash) {
        const pool = poolByHash.get(hash);
        const taken = pool.splice(0, chunkList.length); // consume so no other MapArt can also claim these
        pushAll(mapIdIds, taken.map((m) => m.id));
      }
      actions.case1.push({ mapArt, mapIdIds });
    }
  }

  return actions;
}

// ─────────────────────────────── applying actions ───────────────────────────────

async function deleteMapArtAndItsMapIds(mapArtId) {
  await prisma.mapArtChunk.deleteMany({ where: { mapArtId } });
  const deleted = await prisma.mapId.deleteMany({ where: { mapId: mapArtId } });
  await prisma.mapArt.delete({ where: { id: mapArtId } });
  return deleted.count;
}

async function applyActions(actions, lines) {
  // ===== CASE 1: perform the links =====
  for (const { mapArt, mapIdIds } of actions.case1) {
    await prisma.mapId.updateMany({ where: { id: { in: mapIdIds } }, data: { mapId: mapArt.id } });
    lines.push(`[CASE 1] Linked ${mapIdIds.length} MapId(s) to ${describeMapArt(mapArt, 0)}: ${mapIdIds.join(', ')}`);
  }

  // ===== CASE 2 =====
  for (const { mapId, keptExampleId } of actions.case2) {
    await mapIdModel.deleteMapById(mapId.id);
    lines.push(`[CASE 2] Deleted loose ${describeMapId(mapId)} (duplicate of linked MapId ${keptExampleId})`);
  }

  // ===== CASE 6 (suggested) =====
  for (const { mapId, keptId } of actions.case6) {
    await mapIdModel.deleteMapById(mapId.id);
    lines.push(`[CASE 6] Deleted loose ${describeMapId(mapId)} (duplicate of MapId ${keptId}, kept as canonical)`);
  }

  // ===== CASE 3 =====
  for (const { mapArt, keptExampleId } of actions.case3) {
    await deleteMapArtAndItsMapIds(mapArt.id); // empty, so this deletes 0 MapIds - same helper works either way
    lines.push(`[CASE 3] Deleted empty ${describeMapArt(mapArt, 0)} (duplicate of populated MapArt ${keptExampleId})`);
  }

  // ===== CASE 5 (suggested) =====
  for (const { mapArt, keptId } of actions.case5) {
    await deleteMapArtAndItsMapIds(mapArt.id);
    lines.push(`[CASE 5] Deleted empty ${describeMapArt(mapArt, 0)} (duplicate of MapArt ${keptId}, kept as canonical)`);
  }

  // ===== CASE 4 =====
  for (const { mapArt, keptId, mapIdCount } of actions.case4) {
    const deletedCount = await deleteMapArtAndItsMapIds(mapArt.id);
    lines.push(`[CASE 4] Deleted ${describeMapArt(mapArt, mapIdCount)} and its ${deletedCount} MapId(s) (duplicate of MapArt ${keptId}, kept as canonical)`);
  }
}

function logActionsDry(actions, lines) {
  for (const { mapArt, mapIdIds } of actions.case1) {
    lines.push(`[CASE 1] Would link ${mapIdIds.length} MapId(s) to ${describeMapArt(mapArt, 0)}: ${mapIdIds.join(', ')}`);
  }
  for (const { mapId, keptExampleId } of actions.case2) {
    lines.push(`[CASE 2] Would delete loose ${describeMapId(mapId)} (duplicate of linked MapId ${keptExampleId})`);
  }
  for (const { mapId, keptId } of actions.case6) {
    lines.push(`[CASE 6 - suggested] Would delete loose ${describeMapId(mapId)} (duplicate of MapId ${keptId}, kept as canonical)`);
  }
  for (const { mapArt, keptExampleId } of actions.case3) {
    lines.push(`[CASE 3] Would delete empty ${describeMapArt(mapArt, 0)} (duplicate of populated MapArt ${keptExampleId})`);
  }
  for (const { mapArt, keptId } of actions.case5) {
    lines.push(`[CASE 5 - suggested] Would delete empty ${describeMapArt(mapArt, 0)} (duplicate of MapArt ${keptId}, kept as canonical)`);
  }
  for (const { mapArt, keptId, mapIdCount } of actions.case4) {
    lines.push(`[CASE 4] Would delete ${describeMapArt(mapArt, mapIdCount)} and its ${mapIdCount} MapId(s) (duplicate of MapArt ${keptId}, kept as canonical)`);
  }
  for (const { mapArt } of actions.skippedAmbiguous) {
    lines.push(`[CASE 1 - skipped] ${describeMapArt(mapArt, 0)}: chunk/loose-MapId counts don't line up exactly - needs manual review`);
  }
}

// ─────────────────────────────── main ───────────────────────────────

const writeReport = (lines) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(__dirname, `duplicate-scan-${timestamp}.txt`);
  fs.writeFileSync(reportPath, lines.join('\n') + '\n');
  return reportPath;
};

async function main() {
  const mode = APPLY ? 'APPLY (writes will happen)' : SHOW_FIXES ? 'fixes (dry run, no writes)' : 'report only';
  console.log(`Duplicate scan - mode: ${mode}${SERVER_FILTER ? `, server=${SERVER_FILTER}` : ''}${GLOBAL ? ', report scope=global' : ''}`);

  const missingHashMapIds = await prisma.mapId.count({ where: { OR: [{ pixelHash: null }, { pixelHash: { isSet: false } }] } });
  const missingHashMapArts = await prisma.mapArt.count({ where: { OR: [{ pixelHash: null }, { pixelHash: { isSet: false } }] } });
  if (missingHashMapIds > 0 || missingHashMapArts > 0) {
    console.log(`Warning: ${missingHashMapIds} MapId(s) and ${missingHashMapArts} MapArt(s) have no pixelHash yet and will be invisible to this scan. Run scripts/backfillDuplicateHashes.js first to include them.`);
  }

  const { mapIds, mapArts, chunks, mapIdCountByMapArtId } = await loadData();

  const reportLines = [`Duplicate scan report - ${new Date().toISOString()}`, `Mode: ${mode}`];
  const fixLines = [];
  const applyLines = [];

  const bucketKeys = new Set([
    ...bucketByServer(mapIds, GLOBAL).keys(),
    ...bucketByServer(mapArts, GLOBAL).keys(),
  ]);

  let totalMapIdGroups = 0;
  let totalMapArtGroups = 0;
  const totals = { case1: 0, case2: 0, case3: 0, case4: 0, case5: 0, case6: 0, ambiguous: 0 };

  for (const bucketLabel of bucketKeys) {
    const reportMapIdsInBucket = GLOBAL ? mapIds : mapIds.filter((m) => (m.server || NO_SERVER_KEY) === bucketLabel);
    const reportMapArtsInBucket = GLOBAL ? mapArts : mapArts.filter((a) => (a.server || NO_SERVER_KEY) === bucketLabel);
    const reportChunksInBucket = GLOBAL ? chunks : chunks.filter((c) => (c.server || NO_SERVER_KEY) === bucketLabel);

    const { mapIdGroups, mapArtGroups } = buildRawReportForBucket(
      bucketLabel, reportMapIdsInBucket, reportMapArtsInBucket, reportChunksInBucket, mapIdCountByMapArtId, reportLines
    );
    totalMapIdGroups += mapIdGroups.length;
    totalMapArtGroups += mapArtGroups.length;

    if (!SHOW_FIXES) continue;

    // Safe-fix classification always runs per real server, even under --global (see header comment).
    const fixMapIdsInBucket = mapIds.filter((m) => (m.server || NO_SERVER_KEY) === bucketLabel);
    const fixMapArtsInBucket = mapArts.filter((a) => (a.server || NO_SERVER_KEY) === bucketLabel);
    const fixChunksInBucket = chunks.filter((c) => (c.server || NO_SERVER_KEY) === bucketLabel);
    if (fixMapIdsInBucket.length === 0 && fixMapArtsInBucket.length === 0) continue; // this bucket only existed because of the --global report pass

    const fixMapIdGroups = [...groupBy(fixMapIdsInBucket, (m) => m.pixelHash).values()].filter((g) => g.length > 1);
    const fixMapArtGroups = [...groupBy(fixMapArtsInBucket, (a) => a.pixelHash).values()].filter((g) => g.length > 1);

    const actions = classifyBucket(fixMapIdsInBucket, fixMapArtsInBucket, fixChunksInBucket, mapIdCountByMapArtId, fixMapIdGroups, fixMapArtGroups);

    for (const key of ['case1', 'case2', 'case3', 'case4', 'case5', 'case6']) totals[key] += actions[key].length;
    totals.ambiguous += actions.skippedAmbiguous.length;

    fixLines.push(`\n=== Server: ${bucketLabel} - safe-fix classification ===`);
    const before = fixLines.length;
    logActionsDry(actions, fixLines);
    if (fixLines.length === before) fixLines.push('  (nothing matched a safe-fix case)');

    if (APPLY) {
      applyLines.push(`\n=== Server: ${bucketLabel} - applying safe fixes ===`);
      await applyActions(actions, applyLines);
    }
  }

  console.log(`Raw duplicates found: ${totalMapIdGroups} MapId group(s), ${totalMapArtGroups} MapArt group(s) across ${bucketKeys.size} server bucket(s).`);

  const allLines = [...reportLines];
  if (SHOW_FIXES) {
    console.log(`Safe-fix candidates: case1=${totals.case1} link(s), case2=${totals.case2}, case3=${totals.case3}, case4=${totals.case4}, case5=${totals.case5}, case6=${totals.case6}, ambiguous(case1)=${totals.ambiguous}`);
    pushAll(allLines, fixLines);
  }
  if (APPLY) {
    console.log('Applied safe fixes - see report for details. Run scripts/cleanupOrphanedImages.js afterwards to clean up now-orphaned image files.');
    pushAll(allLines, applyLines);
  } else if (SHOW_FIXES) {
    console.log('Dry run only - no changes made. Re-run with --apply to perform these fixes.');
  } else {
    console.log('Report only - pass --fixes to see which of these would be auto-fixed, or --apply to fix them.');
  }

  const reportPath = writeReport(allLines);
  console.log(`Full report written to: ${reportPath}`);

  await prisma.$disconnect();
}

if (require.main === module) {
  main().catch(async (error) => {
    console.error('Duplicate scan failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
}

module.exports = { main };
