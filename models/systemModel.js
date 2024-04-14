const { exec } = require('child_process');

const runGitPull = (directoryPath) => {
  return new Promise((resolve, reject) => {
    const command = `cd ${directoryPath} && git pull`;

    exec(command, (error, stdout, stderr) => {
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

module.exports = {
  runGitPull,
};
