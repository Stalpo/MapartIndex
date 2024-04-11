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

// Adjust the searchMaps function
const searchMaps = async (page, perPage = 25, user, artist, sort, server, searchTerm) => {
  try {
    const whereMapArt = createFilter(user, artist, server, searchTerm, true); // Include tags for mapArt
    const whereMapId = createFilter(user, artist, server, searchTerm); // Do not include tags for mapId

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
    const combinedMaps = [...mapsArt, ...mapsId].sort((a, b) => b.createdAt - a.createdAt); // Correct sorting order

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

function getOrderBy(sort) {
  switch (sort) {
    case 'nameAsc': return { artist: 'asc' };
    case 'nameDesc': return { artist: 'desc' };
    case 'dateAsc': return { createdAt: 'asc' };
    case 'dateDesc':
    default: return { createdAt: 'desc' };
  }
}

module.exports = { searchMaps };
