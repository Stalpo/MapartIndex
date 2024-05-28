const db = require('../util/db');
const prisma = db.prisma;

const createVisit = async () => {
  try {
    const visit = await prisma.visit.create({ data: {} });
    return visit;
  } catch (error) {
    console.error('Error in createVisit:', error);
    return null;
  }
};

const getVisitById = async (visitId) => {
  try {
    const visit = await prisma.visit.findUnique({
      where: { id: visitId },
    });
    return visit;
  } catch (error) {
    console.error('Error in getVisitById:', error);
    return null;
  }
};

const setVisitUsername = async (visitId, username) => {
  try {
    const visit = await prisma.visit.findUnique({
      where: { id: visitId },
    });

    if (!visit) {
      throw new Error('Visit not found');
    }

    const updatedVisit = await prisma.visit.update({
      where: { id: visitId },
      data: { username },
    });

    return updatedVisit;
  } catch (error) {
    console.error('Error in setVisitUsername:', error);
    return null;
  }
};

const addServerToVisit = async (visitId, server) => {
  try {
    const visit = await prisma.visit.findUnique({
      where: { id: visitId },
    });

    if (!visit) {
      throw new Error('Visit not found');
    }

    const updatedVisit = await prisma.visit.update({
      where: { id: visitId },
      data: { 
        servers: {
          push: server
        }
      },
    });

    return updatedVisit;
  } catch (error) {
    console.error('Error in addServerToVisit:', error);
    return null;
  }
};

const countDailyVisits = async () => {
  try {
    const dayAgo = new Date(new Date().getTime() - 60 * 60 * 24 * 1000);
    const count = await prisma.visit.count({
      where: {
        createdAt: {
          gte: dayAgo.toISOString(),
        },
      },
    });
    return count;
  } catch (error) {
    console.error('Error counting daily visits:', error);
    throw error;
  }
};

const countVisits = async () => {
  try {
    const count = await prisma.visit.count();
    return count;
  } catch (error) {
    console.error('Error counting visits:', error);
    throw error;
  }
};

const countDailyUserVisits = async () => {
  try {
    const dayAgo = new Date(new Date().getTime() - 60 * 60 * 24 * 1000);
    const visits = await prisma.visit.findMany({
      distinct: ['username'],
      where: {
        username: {
          not: null
        },
        createdAt: {
          gte: dayAgo.toISOString(),
        },
      },
    });

    const count = visits.length;
    return count;
  } catch (error) {
    console.error('Error counting visits:', error);
    throw error;
  }
};

const countDailyVisitsByServer = async (server) => {
  try {
    const dayAgo = new Date(new Date().getTime() - 60 * 60 * 24 * 1000);
    const count = await prisma.visit.count({
      where: {
        createdAt: {
          gte: dayAgo.toISOString(),
        },
        servers: {
          has: server
        }
      },
    });
    return count;
  } catch (error) {
    console.error('Error counting daily visits:', error);
    throw error;
  }
};

const countVisitsByServer = async (server) => {
  try {
    const count = await prisma.visit.count({
      where: {
        servers: {
          has: server
        }
      },
    });
    return count;
  } catch (error) {
    console.error('Error counting visits:', error);
    throw error;
  }
};

const countUserVisitsByServer = async (server) => {
  try {
    const visits = await prisma.visit.findMany({
      distinct: ['username'],
      where: {
        username: {
          not: null
        },
        servers: {
          has: server
        }
      },
    });

    const count = visits.length;
    return count;
  } catch (error) {
    console.error('Error counting visits:', error);
    throw error;
  }
};

const countDailyUserVisitsByServer = async (server) => {
  try {
    const dayAgo = new Date(new Date().getTime() - 60 * 60 * 24 * 1000);
    const visits = await prisma.visit.findMany({
      distinct: ['username'],
      where: {
        createdAt: {
          gte: dayAgo.toISOString(),
        },
        username: {
          not: null
        },
        servers: {
          has: server
        }
      },
    });

    const count = visits.length;
    return count;
  } catch (error) {
    console.error('Error counting visits:', error);
    throw error;
  }
};

module.exports = {
  createVisit,
  getVisitById,
  setVisitUsername,
  addServerToVisit,
  countDailyVisits,
  countVisits,
  countDailyUserVisits,
  countDailyVisitsByServer,
  countVisitsByServer,
  countUserVisitsByServer,
  countDailyUserVisitsByServer,
};