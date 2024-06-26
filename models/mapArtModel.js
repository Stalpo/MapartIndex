const prisma = require('../util/db').prisma;

const getAllMapArts = async () => {
  try {
    const maps = await prisma.mapArt.findMany({
      where: {
        userId: {
          not: null,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return maps;
  } catch (error) {
    console.error('Error fetching all maparts:', error);
    throw error;
  }
};

const getMaps = async (page, perPage, user, artist, sort, server, tag) => {
  try {
    const where = {};

    // Apply filtering criteria
    if (user) {
      where.username = user;
    }
    if (artist) {
      where.artist = {
        contains: artist,
        mode: 'insensitive'
      };
    }
    if (server) {
      where.server = server;
    }
    if (tag) {
      where.tags = {
        has: tag
      };
    }

    // Apply sorting criteria
    let orderBy = [{}, { createdAt: 'desc' }];
    switch (sort) {
      case 'nameAsc':
        orderBy[0] = { name: 'asc' };
        break;
      case 'nameDesc':
        orderBy[0] = { name: 'desc' };
        break;
      case 'artistAsc':
        orderBy[0] = { artist: 'asc' };
        break;
      case 'artistDesc':
        orderBy[0] = { artist: 'desc' };
        break;
      case 'dateAsc':
        orderBy = { createdAt: 'asc' };
        break;
      case 'dateDesc':
        orderBy = { createdAt: 'desc' };
        break;
      case 'sizeAsc':
        orderBy[0] = { size: 'asc' };
        break;
      case 'sizeDesc':
        orderBy[0] = { size: 'desc' };
        break;
      case 'viewsAsc':
        orderBy[0] = { views: 'asc' };
        break;
      case 'viewsDesc':
        orderBy[0] = { views: 'desc' };
        break;
      case 'likesAsc':
        orderBy[0] = { likes: 'asc' };
        break;
      case 'likesDesc':
        orderBy[0] = { likes: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    // Adjust pagination if necessary
    let skip = 0;
    let take = Number.MAX_SAFE_INTEGER; // Maximum safe integer if listing all maps
    if (page && perPage) {
      skip = (page - 1) * perPage;
      take = perPage;
    } else if (page && !perPage) {
      // If page is provided but perPage is not, use a default value for perPage
      take = 25; // Default value for perPage
      skip = (page - 1) * take;
    }

    // Fetch maps with pagination, filtering, and sorting
    const maps = await prisma.mapArt.findMany({
      where,
      orderBy,
      skip,
      take,
    });

    return maps;
  } catch (error) {
    console.error('Error fetching maps:', error);
    throw error;
  }
};

const countAllMapArts = async () => {
  try {
    const count = await prisma.mapArt.count();

    return count;
  } catch (error) {
    console.error('Error counting all map arts:', error);
    throw error;
  }
};

const getMapById = async (mapId) => {
  try {
    return await prisma.mapArt.findUnique({
      where: { id: mapId }
    });
  } catch (error) {
    console.error('Error in getMapIdById:', error);
    throw error;
  }
};

const getUniqueUsernames = async () => {
  try {
    const uniqueUsernames = await prisma.mapArt.findMany({
      distinct: ['username'],
      select: {
        username: true,
      },
    });
    return uniqueUsernames.map(({ username }) => username);
  } catch (error) {
    console.error('Error fetching unique usernames:', error);
    throw error;
  }
};

const getUniqueArtists = async () => {
  try {
    const uniqueArtists = await prisma.mapArt.findMany({
      distinct: ['artist'],
      select: {
        artist: true,
      },
    });
    return uniqueArtists.map(({ artist }) => artist);
  } catch (error) {
    console.error('Error fetching unique artists:', error);
    throw error;
  }
};

const getUniqueServers = async () => {
  try {
    const uniqueServers = await prisma.mapArt.findMany({
      distinct: ['server'],
      select: {
        server: true,
      },
    });
    const filteredServers = uniqueServers.filter(({ server }) => server !== null);
    return filteredServers.map(({ server }) => server);
  } catch (error) {
    console.error('Error fetching unique servers:', error);
    throw error;
  }
};

const getUniqueTags = async () => {
  try {
    const mapArtRecords = await prisma.mapArt.findMany({
      select: {
        tags: true,
      },
    });

    // Flatten the tags arrays and filter out null or undefined values
    const allTags = mapArtRecords.flatMap(record => record.tags || []).filter(tag => tag);

    // Create a Set to ensure uniqueness, then convert it back to an array
    const uniqueTags = [...new Set(allTags)];

    return uniqueTags;
  } catch (error) {
    console.error('Error fetching unique tags:', error);
    throw error;
  }
};

const createMapId = async ({ userId, username, artist, name, description, mapIds, width, height, tags, imgUrl, displayName, hash, server, serverId, nsfw }) => {
  try {
    const size = width * height;
    return await prisma.mapArt.create({
      data: {
        user: {
          connect: {
            id: userId
          }
        },
        username,
        artist,
        name,
        description,
        mapIds: {
          connect: mapIds.map(id => ({ id }))
        },
        size: size,
        width,
        height,
        tags,
        imgUrl,
        displayName,
        hash,
        server,
        serverId,
        nsfw,
      }
    });
  } catch (error) {
    console.error('Error creating map ID:', error);
    throw error;
  }
};

const updateMapById = async (mapId, { artist, name, description, nsfw, tags }) => {
  try {
    return await prisma.mapArt.update({
      where: { id: mapId },
      data: {
        artist,
        name,
        description,
        nsfw,
        tags,
      },
    });
  } catch (error) {
    console.error('Error in updateMapById:', error);
    throw error;
  }
};

const incrementMapViews = async (mapId) => {
  try {
    const mapArt = await prisma.mapArt.findUnique({
      where: { id: mapId }
    });
    if (mapArt.id) {
      const views = mapArt.views + 1;
      return await prisma.mapArt.update({
        where: { id: mapId },
        data: {
          views,
        },
      });
    } else {
      throw new Error('Cannot increment map that doesnt exist.');
    }
  } catch (error) {
    console.error('Error in incrementMapViews:', error);
    throw error;
  }
};

const setFavoriteMapArtId = async (userId, mapArtId) => {
  try {
    const profile = await prisma.profile.findUnique({ where: { userId: userId } });
    if (profile) {
      let favorites = profile.favorites || [];

      if (!favorites.includes(mapArtId)) {
        favorites.push(mapArtId);

        const updatedProfile = await prisma.user.update({
          where: { id: userId },
          data: {
            Profile: {
              update: {
                favorites: favorites,
              }
            }
          },
        });

        return updatedProfile;
      } else {
        throw new Error('That favorite has already been saved');
      }

    } else {
      throw new Error('That profile does not exist');
    }
  } catch (error) {
    console.error('Error in setFavoriteMapArtId:', error);
  }
};

const removeFavoriteMapArtId = async (userId, mapArtId) => {
  try {
    const profile = await prisma.profile.findUnique({ where: { userId: userId } });
    if (profile) {
      let favorites = profile.favorites || [];

      if (favorites.includes(mapArtId)) {
        favorites = favorites.filter(fav => fav !== mapArtId);

        const updatedProfile = await prisma.user.update({
          where: { id: userId },
          data: {
            Profile: {
              update: {
                favorites: favorites,
              }
            }
          },
        });

        return updatedProfile;
      } else {
        throw new Error('That favorite does not exist');
      }
    } else {
      throw new Error('That profile does not exist');
    }
  } catch (error) {
    console.error('Error in removeFavoriteMapArtId:', error);
  }
};

 const isMapArtFavorite = async (userId, mapArtId) => {
  try {
    const profile = await prisma.profile.findUnique({ where: { userId: userId } });
    if (profile) {
      const favorites = profile.favorites || [];
      return favorites.includes(mapArtId);
    } else {
      throw new Error('Profile not found');
    }
  } catch (error) {
    console.error('Error checking favorite status:', error);
    throw error;
  }
}

const likeMapArtId = async (userId, mapArtId) => {
  try {
    // Retrieve the current mapArt item including its likedBy array
    const mapArt = await prisma.mapArt.findUnique({
      where: { id: mapArtId },
      select: { likedBy: true }
    });

    if (!mapArt) {
      throw new Error('MapArt not found');
    }

    // Check if the userId is already in the likedBy array
    if (!mapArt.likedBy.includes(userId)) {
      // If not included, proceed with the update
      const updatedMapArt = await prisma.mapArt.update({
        where: { id: mapArtId },
        data: {
          likes: {
            increment: 1
          },
          likedBy: {
            push: userId
          }
        }
      });
      return updatedMapArt;
    } else {
      throw new Error('User has already liked this map art');
    }
  } catch (error) {
    console.error('Error liking map art:', error);
    throw error;
  }
}

const unlikeMapArtId = async (userId, mapArtId) => {
  try {
    const mapArt = await prisma.mapArt.findUnique({
      where: { id: mapArtId },
      select: { likedBy: true }
    });

    if (!mapArt) {
      throw new Error('MapArt not found');
    }

    const updatedLikedBy = mapArt.likedBy.filter(id => id !== userId);

    const updatedMapArt = await prisma.mapArt.update({
      where: { id: mapArtId },
      data: {
        likes: {
          decrement: 1
        },
        likedBy: updatedLikedBy
      }
    });

    return updatedMapArt;
  } catch (error) {
    console.error('Error unliking map art:', error);
    throw error;
  }
};

const isMapArtIdLiked = async (userId, mapArtId) => {
  try {
    const likedMapArt = await prisma.mapArt.findFirst({
      where: {
        id: mapArtId,
        likedBy: {
          has: userId
        }
      }
    });

    return !!likedMapArt;
  } catch (error) {
    console.error('Error checking if mapArt is liked:', error);
    throw error;
  }
}

const countMapIdsByServer = async (server) => {
  try {
    const count = await prisma.mapArt.count({
      where: {
        server: server,
      },
    });
    return count;
  } catch (error) {
    console.error('Error counting map IDs by server:', error);
    throw error;
  }
};

const getLatestServerIdByServer = async (server) => {
  try {
    const allEntries = await prisma.mapArt.findMany({
      where: {
        server: server
      },
      select: {
        serverId: true
      }
    });

    const serverIds = allEntries.map(entry => entry.serverId);
    serverIds.sort((a, b) => b - a);
    if (serverIds[0] === undefined) {
      serverIds[0] = 0;
    }
    return serverIds[0];
  } catch (error) {
    console.error('Error fetching highest serverId:', error);
    throw error;
  }
};

const fetchMapsMissingInfo = async (type) => {
  let whereClause = {};

  switch (type) {
    case 'name':
      whereClause = { 
        OR: [
          { name: "" },
          { name: { isSet: false } },
        ], 
      };
      break;
    case 'artist':
      whereClause = { artist: "N/A" };
      break;
    case 'description':
      whereClause = { description: "" };
      break;
    case 'tags':
      whereClause = { tags: { equals: [] } };
      break;
    case 'all':
      whereClause = { 
        OR: [
          { name: "" },
          { name: { isSet: false } },
          { artist: "N/A" },
          { description: "" },
          { tags: { equals: [] } },
        ],
      };
      break;
    default:
      // all but desc
      whereClause = {
        OR: [
          { name: "" },
          { name: { isSet: false } },
          { artist: "N/A" },
          { tags: { equals: [] } },
        ],
      };
      break;
  }

  try {
    const maps = await prisma.mapArt.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return maps;
  } catch (error) {
    console.error('Error fetching maps with missing information:', error);
    throw error;
  }
};

const fetchLatestUpdatedAt = async (limit) => {
  try {
    return await prisma.mapArt.findMany({
      orderBy: {
        updatedAt: 'desc'
      },
      take: limit
    });
  } catch (error) {
    console.error('Error in fetchLatestUpdatedAt:', error);
    throw error;
  }
};

const deleteMapById = async (mapId) => {
  try {
    return await prisma.mapArt.delete({ where: { id: mapId } });
  } catch (error) {
    console.error('Error in deleteMapId:', error);
    throw error;
  }
};

module.exports = {
  getAllMapArts,
  getMaps,
  countAllMapArts,
  getMapById,
  getUniqueArtists,
  getUniqueUsernames,
  getUniqueServers,
  getUniqueTags,
  createMapId,
  updateMapById,
  incrementMapViews,
  setFavoriteMapArtId,
  removeFavoriteMapArtId,
  isMapArtFavorite,
  likeMapArtId,
  unlikeMapArtId,
  isMapArtIdLiked,
  countMapIdsByServer,
  getLatestServerIdByServer,
  fetchMapsMissingInfo,
  fetchLatestUpdatedAt,
  deleteMapById,
};