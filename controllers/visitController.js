const visitModel = require('../models/visitModel');

const createVisit = async () => {
  try {
    return await visitModel.createVisit();
  } catch (error) {
    console.error('Error creating visit:', error);
    throw error;
  }
};

const getVisitById = async (visitId) => {
  try {
    return await visitModel.getVisitById(visitId);
  } catch (error) {
    console.error('Error getting visit by id:', error);
    throw error;
  }
};

const setVisitUsername = async (visitId, username) => {
  try {
    return await visitModel.setVisitUsername(visitId, username);
  } catch (error) {
    console.error('Error setting visit username:', error);
    throw error;
  }
};

const addServerToVisit = async (visitId, server) => {
  try {
    return await visitModel.addServerToVisit(visitId, server);
  } catch (error) {
    console.error('Error adding server to visit:', error);
    throw error;
  }
};

const countDailyVisits = async () => {
  try {
    return await visitModel.countDailyVisits();
  } catch (error) {
    console.error('Error counting daily visits:', error);
    throw error;
  }
};

const countVisits = async () => {
  try {
    return await visitModel.countVisits();
  } catch (error) {
    console.error('Error counting visits:', error);
    throw error;
  }
};

const countDailyUserVisits = async () => {
  try {
    return await visitModel.countDailyUserVisits();
  } catch (error) {
    console.error('Error counting daily user visits:', error);
    throw error;
  }
};

const countDailyVisitsByServer = async (server) => {
  try {
    return await visitModel.countDailyVisitsByServer(server);
  } catch (error) {
    console.error('Error counting daily visits by server:', error);
    throw error;
  }
};

const countVisitsByServer = async (server) => {
  try {
    return await visitModel.countVisitsByServer(server);
  } catch (error) {
    console.error('Error counting visits by server:', error);
    throw error;
  }
};

const countUserVisitsByServer = async (server) => {
  try {
    return await visitModel.countUserVisitsByServer(server);
  } catch (error) {
    console.error('Error counting user visits by server:', error);
    throw error;
  }
};

const countDailyUserVisitsByServer = async (server) => {
  try {
    return await visitModel.countDailyUserVisitsByServer(server);
  } catch (error) {
    console.error('Error counting daily user visits by server:', error);
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
}