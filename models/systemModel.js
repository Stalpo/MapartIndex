// systemModel.js
const { exec } = require('child_process');

const runCommand = (directoryPath, command) => {
  return new Promise((resolve, reject) => {
    const fullCommand = `cd ${directoryPath} && ${command}`;

    exec(fullCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return reject(error);
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return reject(new Error(stderr));
      }
      console.log(`stdout: ${stdout}`);
      resolve(stdout);
    });
  });
};

const runGitPull = (directoryPath) => {
  return runCommand(directoryPath, 'git pull');
};

const restartPm2 = (directoryPath) => {
  return runCommand(directoryPath, 'pm2 restart index');
};

module.exports = {
  runGitPull,
  restartPm2,
};
