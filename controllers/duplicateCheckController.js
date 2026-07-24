const mapIdModel = require('../models/mapIdModel');
const mapArtModel = require('../models/mapArtModel');

// Case 1: a MapId against every other MapId
const checkMapIdVsMapIds = async (mapIdId, { global = false } = {}) => {
  const target = await mapIdModel.getMapIdById(mapIdId);
  if (!target) throw new Error('MapId not found');
  if (!target.pixelHash) return { needsBackfill: true, matches: [] };

  const server = global ? undefined : target.server;
  const matches = await mapIdModel.getMapIdsByPixelHash(target.pixelHash, { excludeId: target.id, server });

  return {
    needsBackfill: false,
    matches: matches.map((record) => ({ type: 'mapid', record })),
  };
};

// Case 2: a MapArt against every other MapArt
const checkMapArtVsMapArts = async (mapArtId, { global = false } = {}) => {
  const target = await mapArtModel.getMapById(mapArtId);
  if (!target) throw new Error('MapArt not found');
  if (!target.pixelHash) return { needsBackfill: true, matches: [] };

  const server = global ? undefined : target.server;
  const matches = await mapArtModel.getMapArtsByPixelHash(target.pixelHash, { excludeId: target.id, server });

  return {
    needsBackfill: false,
    matches: matches.map((record) => ({ type: 'mapart', record })),
  };
};

// Case 3: a MapId against every 128x128 chunk of every MapArt.
// Excludes chunks belonging to the MapArt this MapId is already officially linked to.
const checkMapIdVsMapArtChunks = async (mapIdId, { global = false } = {}) => {
  const target = await mapIdModel.getMapIdById(mapIdId);
  if (!target) throw new Error('MapId not found');
  if (!target.pixelHash) return { needsBackfill: true, matches: [] };

  const server = global ? undefined : target.server;
  const chunkMatches = await mapArtModel.getMapArtChunksByHash(target.pixelHash, { server });
  const filtered = chunkMatches.filter((chunk) => chunk.mapArtId !== target.mapId);

  return {
    needsBackfill: false,
    matches: filtered.map((chunk) => ({
      type: 'mapart-chunk',
      record: chunk.mapArt,
      position: { x: chunk.x, y: chunk.y },
    })),
  };
};

// Case 4: every 128x128 chunk of a MapArt against every MapId.
// Excludes MapIds already officially linked to this MapArt.
const checkMapArtVsMapIdChunks = async (mapArtId, { global = false } = {}) => {
  const target = await mapArtModel.getMapById(mapArtId);
  if (!target) throw new Error('MapArt not found');

  const chunks = await mapArtModel.getMapArtChunks(mapArtId);
  if (chunks.length === 0) return { needsBackfill: true, matches: [] };

  const server = global ? undefined : target.server;
  const uniqueHashes = [...new Set(chunks.map((chunk) => chunk.hash))];
  const mapIdMatches = await mapIdModel.getMapIdsByPixelHashes(uniqueHashes, { server });

  const matchesByHash = {};
  for (const mapId of mapIdMatches) {
    if (mapId.mapId === target.id) continue;
    if (!matchesByHash[mapId.pixelHash]) matchesByHash[mapId.pixelHash] = [];
    matchesByHash[mapId.pixelHash].push(mapId);
  }

  const matches = [];
  for (const chunk of chunks) {
    const found = matchesByHash[chunk.hash] || [];
    for (const record of found) {
      matches.push({ type: 'mapid-chunk', record, position: { x: chunk.x, y: chunk.y } });
    }
  }

  return { needsBackfill: false, matches };
};

// Case 5: combine 1 + 3 for a full MapId duplicate check
const checkMapIdAll = async (mapIdId, options = {}) => {
  const [vsMapIds, vsMapArtChunks] = await Promise.all([
    checkMapIdVsMapIds(mapIdId, options),
    checkMapIdVsMapArtChunks(mapIdId, options),
  ]);

  return {
    needsBackfill: vsMapIds.needsBackfill || vsMapArtChunks.needsBackfill,
    matches: [...vsMapIds.matches, ...vsMapArtChunks.matches],
  };
};

// Case 6: combine 2 + 4 for a full MapArt duplicate check
const checkMapArtAll = async (mapArtId, options = {}) => {
  const [vsMapArts, vsMapIdChunks] = await Promise.all([
    checkMapArtVsMapArts(mapArtId, options),
    checkMapArtVsMapIdChunks(mapArtId, options),
  ]);

  return {
    needsBackfill: vsMapArts.needsBackfill || vsMapIdChunks.needsBackfill,
    matches: [...vsMapArts.matches, ...vsMapIdChunks.matches],
  };
};

module.exports = {
  checkMapIdVsMapIds,
  checkMapArtVsMapArts,
  checkMapIdVsMapArtChunks,
  checkMapArtVsMapIdChunks,
  checkMapIdAll,
  checkMapArtAll,
};
