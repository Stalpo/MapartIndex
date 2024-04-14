const systemModel = require('../models/systemModel');

// Controller to run git pull using the directory path stored in res.locals.filepath
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

module.exports = {
  runGitPull,
};