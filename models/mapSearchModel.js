const prisma = require('../util/db').prisma;

// Shared non-nsfw filter fields (user/artist/server + optional search term) common to both
// MapArt and MapId searches.
const baseFilterFields = (user, artist, server) => {
  const filter = {};
  if (user) filter.username = user;
  if (artist) filter.artist = artist;
  if (server) filter.server = server;
  return filter;
};

const searchTermOr = (searchTerm, includeTags = false, includeNames = false) => {
  if (!searchTerm) return null;
  const or = [
    { displayName: { contains: searchTerm, mode: 'insensitive' } },
    { artist: { contains: searchTerm, mode: 'insensitive' } },
    { server: { contains: searchTerm, mode: 'insensitive' } },
  ];
  if (includeNames) {
    or.push({ name: { contains: searchTerm, mode: 'insensitive' } });
  }
  if (includeTags) {
    or.push({ tags: { hasSome: [searchTerm] } });
  }
  return or;
};

// MapArt still has its own nsfw field, so this stays a simple equality filter.
const createMapArtFilter = (user, artist, server, searchTerm) => {
  const filter = { nsfw: false, ...baseFilterFields(user, artist, server) };
  const or = searchTermOr(searchTerm, true, true);
  if (or) filter.OR = or;
  return filter;
}

// MapId has no nsfw field of its own - it mirrors its linked MapArt's nsfw (see withDerivedNsfw
// in models/mapIdModel.js), so "not nsfw" here means either it has no MapArt link at all, or its
// MapArt isn't nsfw. That's an OR condition, and searchTermOr is also an OR condition, so they're
// combined via AND rather than both being flattened onto the same `OR` key (which would silently
// clobber one of them).
const createMapIdFilter = (user, artist, server, searchTerm) => {
  const filter = baseFilterFields(user, artist, server);
  const notNsfw = {
    OR: [
      { mapId: null },
      { mapId: { isSet: false } },
      { map: { is: { nsfw: false } } },
    ],
  };
  const searchOr = searchTermOr(searchTerm);
  filter.AND = searchOr ? [notNsfw, { OR: searchOr }] : [notNsfw];
  return filter;
}

// Helper function to create sorting object for queries
const getOrderBy = (sort) => {
  switch (sort) {
    case 'nameAsc': return { artist: 'asc' };
    case 'nameDesc': return { artist: 'desc' };
    case 'dateAsc': return { createdAt: 'asc' };
    case 'dateDesc':
    default: return { createdAt: 'desc' };
  }
}

// searchMaps with pagination for search page
const searchMaps = async (page = 1, perPage = 25, user, artist, sort, server, searchTerm) => {
  try {
    const whereMapArt = createMapArtFilter(user, artist, server, searchTerm);
    const whereMapId = createMapIdFilter(user, artist, server, searchTerm);

    // Fetch data from both models
    const mapsArt = await prisma.mapArt.findMany({
      where: whereMapArt,
      orderBy: getOrderBy(sort)
    });

    const mapsId = await prisma.mapId.findMany({
      where: whereMapId,
      orderBy: getOrderBy(sort)
    });

    // Combine and sort the results from both models
    const combinedMaps = [...mapsArt, ...mapsId].sort((a, b) => b.createdAt - a.createdAt);

    // Manually apply pagination
    const startIndex = (page - 1) * perPage;
    const paginatedMaps = combinedMaps.slice(startIndex, startIndex + perPage);
    const totalPages = Math.ceil(combinedMaps.length / perPage);

    return { maps: paginatedMaps, totalPages };
  } catch (error) {
    console.error('Error fetching maps:', error);
    throw error;
  }
};

module.exports = { searchMaps };