const prisma = require('../util/db').prisma;

// Helper function to create filter objects for queries
function createFilter(user, artist, server, searchTerm, includeTags = false) {
  const filter = {};
  if (user) filter.username = user;
  if (artist) filter.artist = artist;
  if (server) filter.server = server;
  if (searchTerm) {
    filter.OR = [
      { displayName: { contains: searchTerm, mode: 'insensitive' } },
      { username: { contains: searchTerm, mode: 'insensitive' } },
      { artist: { contains: searchTerm, mode: 'insensitive' } },
      { server: { contains: searchTerm, mode: 'insensitive' } },
    ];
    if (includeTags) {
      filter.OR.push({ tags: { hasSome: [searchTerm] } });
    }
  }
  return filter;
}

function getOrderBy(sort) {
  switch (sort) {
    case 'nameAsc': return { artist: 'asc' };
    case 'nameDesc': return { artist: 'desc' };
    case 'dateAsc': return { createdAt: 'asc' };
    case 'dateDesc':
    default: return { createdAt: 'desc' };
  }
}

const searchMaps = async (page = 1, perPage = 25, user, artist, sort, server, searchTerm) => {
  try {
    page = Number(page);
    perPage = Number(perPage);

    const whereMapArt = createFilter(user, artist, server, searchTerm, true);
    const whereMapId = createFilter(user, artist, server, searchTerm);

    const mapsArt = await prisma.mapArt.findMany({
      where: whereMapArt,
      orderBy: getOrderBy(sort),
      skip: (page - 1) * perPage,
      take: perPage
    });

    const mapsId = await prisma.mapId.findMany({
      where: whereMapId,
      orderBy: getOrderBy(sort),
      skip: (page - 1) * perPage,
      take: perPage
    });

    const combinedMaps = [...mapsArt, ...mapsId].sort((a, b) => b.createdAt - a.createdAt);

    const totalItems = mapsArt.length + mapsId.length;
    const totalPages = Math.ceil(totalItems / perPage);

    return { maps: combinedMaps, totalPages };
  } catch (error) {
    console.error('Error fetching maps:', error);
    throw error;
  }
};

module.exports = { searchMaps };
