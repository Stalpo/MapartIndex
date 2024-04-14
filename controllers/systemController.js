// systemController.js
const systemModel = require('../models/systemModel');

const runGitPull = async (req, res) => {
  const directoryPath = res.locals.filepath;

  try {
    const result = await systemModel.runGitPull(directoryPath);
    console.log('Git pull successful:', result);
    return `{ message: 'Git pull successful', data: ${result} }`;
  } catch (error) {
    console.error('Error in runGitPull:', error.message);
    return `{ error: 'Failed to run git pull', details: ${error.message} }`;
  }
};

const restartPm2 = async (req, res) => {
  const directoryPath = res.locals.filepath;

  try {
    const result = await systemModel.restartPm2(directoryPath);
    console.log('PM2 restart successful:', result);
    return `{ message: 'PM2 restart successful', data: ${result} }`;
  } catch (error) {
    console.error('Error in restartPm2:', error.message);
    return `{ error: 'Failed to restart PM2', details: ${error.message} }`;
  }
};

module.exports = {
  runGitPull,
  restartPm2,
};
