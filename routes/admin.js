const express = require('express');
const router = express.Router();
const multer = require('multer');
const archiver = require('archiver');

// Required controllers
const userController = require('../controllers/userController');

// Multer config
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/tmp'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
  }),
  fileFilter: (req, file, cb) => cb(null, true),
  limits: { fileSize: 1024 * 64 } // 64 KB limit
});

router.get('/', async (req, res) => {
  try {
    const allUsers = await userController.getAllUsers();
    res.render('admin', { allUsers });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/download', (req, res) => {
  if (res.locals.admin) {
    const uploadDir = './public/uploads';
    const currentDate = new Date().toISOString().slice(0,10);
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' }).replace(/:/g, '-');
    const zipFileName = `uploads_${currentDate}_${currentTime}.zip`;
  
    const archive = archiver('zip', {
        zlib: { level: 9 } // Set compression level
    });
  
    archive.pipe(res);
    archive.directory(uploadDir, false);
    archive.finalize();
  
    res.attachment(zipFileName);
  } else {
    res.redirect('/admin');
  }
});

// initialPush route
router.get('/initialPush', async (req, res) => {
  if (!res.locals.admin) {
    return res.status(403).send('Forbidden');
  }
  res.render('initialPush');
});

// POST endpoint for initial push
router.post('/initialPush', upload.array('images', 4000), async (req, res) => {
  try {
    // Check if user is an admin
    if (!res.locals.admin) {
      return res.status(403).send('Forbidden');
    }

    const { files } = req;
    files.sort(compareForInitialPush);

    if (!files || files.length === 0) {
      // If no files are provided
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedFiles = [];
    const oldmaparts = [];

    // Process each file
    for (const file of files) {
      const { filename, path, originalname } = file;

      // if maplist file store mapart configs
      if(filename.includes('mapList.js')){
        const data = fs.readFileSync(path).toString();

        const almostFullMaps = data.split('new FullMap("",');

        const fullMaps = [];
        let skip = true;
        for(const almostFullMap of almostFullMaps){
          if(skip){
            skip = false;
            continue;
          }
          fullMaps.push(almostFullMap.split(')')[0]);
        }

        for(const fullMap of fullMaps){
          const fullMapInfo = fullMap.split(', ');
          const special = [];
          for(let i = 3; i < fullMapInfo.length; i+=2){
            special.push([parseInt(fullMapInfo[i].charAt(fullMapInfo[i].length - 1)), parseInt(fullMapInfo[i + 1].charAt(0))]);
          }
          const mapArt = {
            startIndex: parseInt(fullMapInfo[0]),
            width: parseInt(fullMapInfo[1]),
            height: parseInt(fullMapInfo[2]),
            special: special
          };

          oldmaparts.push(mapArt);
        }
        continue;
      }

      // Generate the desired filename based on server
      const server = req.body.server;
      const newFilename = await mapIdController.generateFilename(server);

      // Get current map count + 1
      const serverId = await mapIdController.getLatestServerIdByServer(server) + 1;

      // Construct the new filepath manually
      const newFilepath = __dirname + '/public/uploads/' + newFilename;

      let displayName;
      if (newFilename.endsWith(".png")) {
        displayName = newFilename.slice(0, -4);
      }

      // Rename the file
      fs.renameSync(path, newFilepath);

      // Read the image file and convert it to base64
      const base64 = fs.readFileSync(newFilepath, { encoding: 'base64' });

      // Calculate a hash of the base64 data
      const hash = crypto.createHash('md5').update(base64).digest('hex');

      // Add metadata to the db
      await mapIdController.createMapId({
        userId: res.locals.userId,
        username: res.locals.username,
        imgUrl: newFilename,
        displayName: displayName,
        hash: hash,
        server: req.body.server,
        serverId: serverId,
      });

      uploadedFiles.push({
        originalname,
        filename: newFilename,
        path: newFilepath
      });
    }

    // Send a response with the mapart stitching info
    res.status(200).json({ message: 'Upload successful', mapArtInfo: oldmaparts, files: uploadedFiles });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// sort function for initial push
function compareForInitialPush(a, b) {
  if(a.filename.includes('mapList.js')){
    return -1;
  }else if(b.filename.includes('mapList.js')){
    return 1;
  }
  return parseInt(a.filename.split('_')[1]) - parseInt(b.filename.split('_')[1]);
}

module.exports = router;