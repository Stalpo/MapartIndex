const express = require('express');
const router = express.Router();
const multer = require('multer');
const archiver = require('archiver');
const fs = require('fs');
const crypto = require('crypto');
const os = require('os');


// Required for DB stats
const prisma = require('../util/db').prisma;
const { MongoClient } = require('mongodb');

// Required controllers
const userController = require('../controllers/userController');
const mapIdController = require('../controllers/mapIdController');
const mapArtController = require('../controllers/mapArtController');

// Multer config
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/tmp'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
  }),
  fileFilter: (req, file, cb) => cb(null, true),
  limits: { fileSize: 1024 * 1024 * 128 } // 128 MB limit
});

router.get('/', async (req, res) => {
  try {
    res.render('admin');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/recentUpdates', async (req, res) => {
  try {
    res.render('admin-recent');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/mapart/recentUpdates', async (req, res) => {
  let { limit } = req.query;
  if (!limit) { limit = 10; }
  try {
    if (res.locals.admin) {
      const result = await mapArtController.fetchLatestUpdatedAt(Number(limit));
      res.json(result);
    } else {
      return res.status(403).send('Forbidden');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/mapid/recentUpdates', async (req, res) => {
  let { limit } = req.query;
  if (!limit) { limit = 10; }
  try {
    if (res.locals.admin) {
      const result = await mapIdController.fetchLatestUpdatedAt(Number(limit));
      res.json(result);
    } else {
      return res.status(403).send('Forbidden');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/users', async (req, res) => {
  try {
    if (res.locals.admin) {
      const allUsers = await userController.getAllUsers();
      res.json(allUsers);
    } else {
      return res.status(403).send('Forbidden');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/users/orphanProfiles', async (req, res) => {
  try {
    if (res.locals.admin) {
      const orphans = await userController.getProfilesWithoutUser();
      console.log(orphans);
      res.json(orphans);
    } else {
      return res.status(403).send('Forbidden');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/users/orphanProfiles', async (req, res) => {
  try {
    if (res.locals.admin) {
      const result = await userController.deleteOrphanProfiles();
      if (result.error) {
        return res.status(500).json({ message: 'Failed to delete orphan profiles', error: result.error });
      }
      res.json(result);
    } else {
      return res.status(403).send('Forbidden');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// GET user by ID
router.get('/users/:userId', async (req, res) => {
  try {
    if (res.locals.admin) {
      const { userId } = req.params;
      const user = await userController.getUserById(userId);
      res.json(user);
    } else {
      return res.status(403).send('Forbidden');
    }
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/set-admin/:userId', async (req, res) => {
  try {
    if (res.locals.admin) {
      const { userId } = req.params;
      const { bool } = req.query;
      const isAdmin = bool === 'true';
      await userController.setAdminStatus(userId, isAdmin);
      res.status(200).send(`User admin status set to ${isAdmin} successfully`);
    } else {
      return res.status(403).send('Forbidden');
    }
  } catch (error) {
    console.error('Error setting user as admin:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/set-mod/:userId', async (req, res) => {
  try {
    if (res.locals.admin) {
      const { userId } = req.params;
      const { bool } = req.query;
      const isMod = bool === 'true';
      await userController.setModStatus(userId, isMod);
      res.status(200).send(`User mod status set to ${isMod} successfully`);
    } else {
      return res.status(403).send('Forbidden');
    }
  } catch (error) {
    console.error('Error setting user as mod:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/system-info', (req, res) => {
  try {
    if (res.locals.admin) {
      const systemInfo = {
        host: os.hostname(),
        os: {
          platform: os.platform(),
          type: os.type(),
          arch: os.arch(),
          release: os.release(),
        },
        cpu: {
          model: os.cpus()[0].model,
          cores: os.cpus().length,
          speed: os.cpus()[0].speed
        },
        ram: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
        uptime: `${(os.uptime() / 3600).toFixed(2)} hours`,
        networkInterfaces: os.networkInterfaces(),
        userInfo: {
          username: os.userInfo().username,
          homedir: os.userInfo().homedir
        },
        loadAverage: os.loadavg(),
        totalMemory: `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
        freeMemory: `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`
      };

      res.json(systemInfo);
    } else {
      return res.status(403).send('Forbidden');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/db-stats', async (req, res) => {
  try {
    if (res.locals.admin) {
      // Use the same MongoDB URI for Prisma and MongoDB driver
      const client = new MongoClient(process.env.DATABASE_URL);
      await client.connect();
      const db = client.db();

      // Count documents in different collections using Prisma models
      const usersCount = await prisma.user.count();
      const profilesCount = await prisma.profile.count();
      const mapArtsCount = await prisma.mapArt.count();
      const mapIdsCount = await prisma.mapId.count();

      // MongoDB-specific statistics
      const collections = await db.listCollections().toArray();
      const serverStatus = await db.admin().serverStatus();
      const storageStats = await db.stats();

      res.json({
        usersCount,
        profilesCount,
        mapArtsCount,
        mapIdsCount,
        collections,
        serverStatus,
        storageStats,
      });

      await client.close();
    } else {
      return res.status(403).send('Forbidden');
    }
  } catch (error) {
    console.error('Error fetching DB stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/download', (req, res) => {
  if (res.locals.admin) {
    const filepath = res.locals.filepath;
    const uploadDir = filepath + '/public/uploads';
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
  res.render('admin-initial');
});

// POST endpoint for initial push
router.post('/initialPush', upload.array('images', 8000), async (req, res) => {
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
      // Get current map count + 1
      const serverId = await mapIdController.getLatestServerIdByServer(server) + 1;
      const newFilepath = `${res.locals.filepath}/public/uploads/${newFilename}`;

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