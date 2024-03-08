const db = require('../util/db');
const prisma = db.prisma;

const getProfileById = async (userId) => {
  return prisma.profile.findUnique({
    where: {
      userId
    }
  });
};

const createProfile = async ( { userId } ) => { await prisma.profile.create(userId); };

const updateProfile = async (userId, {
  username,
  location,
  email,
  discordId,
  mcUuid,
  lastSeen,
  bio,
  avatar,
}) => {
  await prisma.profile.update({
    where: {
      userId
    },
    data: {
      username,
      location,
      email,
      discordId,
      mcUuid,
      lastSeen,
      bio,
      avatar,
    }
  });
};

const updateUsername = async (userId, username) => {
    await prisma.profile.update({
        where: {
        userId
        },
        data: {
        username
        }
    });

}
const updateLocation = async (userId, location) => {
    await prisma.profile.update({
        where: {
        userId
        },
        data: {
        location
        }
    });

}
const updateEmail = async (userId, email) => {
    await prisma.profile.update({
        where: {
        userId
        },
        data: {
        email
        }
    });
}
const updateDiscordId = async (userId, discordId) => {
    await prisma.profile.update({
        where: {
        userId
        },
        data: {
        discordId
        }
    });
}
const updateMcUuid = async (userId, mcUuid) => {
    await prisma.profile.update({
        where: {
        userId
        },
        data: {
        mcUuid
        }
    });
}
const updateLastSeen = async (userId, lastSeen) => {
    await prisma.profile.update({
        where: {
        userId
        },
        data: {
        lastSeen
        }
    });
}
const updateBio = async (userId, bio) => {
    await prisma.profile.update({
        where: {
        userId
        },
        data: {
        bio
        }
    });
}
const updateAvatar = async (userId, avatar) => {
    await prisma.profile.update({
        where: {
        userId
        },
        data: {
        avatar
        }
    });
}
const updateLinks = async (userId, links) => {
    await prisma.profile.update({
        where: {
        userId
        },
        data: {
        links
        }
    });
}


module.exports = {
  getProfileById,
  createProfile,
  updateProfile,
  updateUsername,
  updateLocation,
  updateEmail,
  updateDiscordId,
  updateMcUuid,
  updateLastSeen,
  updateBio,
  updateAvatar,
  updateLinks

};