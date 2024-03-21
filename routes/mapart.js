const express = require('express');
const router = express.Router();
const validator = require('validator');
const multer = require('multer');
const pathb = require('path');

// Required controllers
const userController = require('../controllers/userController');
const mapArtController = require('../controllers/mapArtController');

// Multer config
const mapArtStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../public/uploads/mapArt/tmp'); // Upload files to a directory specific to mapArt
  },
  filename: function (req, file, cb) {
    // Generate a unique filename based on timestamp and random string
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + '.png'; // Ensure the file ends with .png
    cb(null, filename);
  }
});

// File filter for multer
const fileFilter = (req, file, cb) => {
  // Check if the file is a PNG image
  if (file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Only PNG images are allowed!'), false);
  }
};

// Init multer storage, file filter, and limits for /mapArt-create
const mapArtUpload = multer({
  storage: mapArtStorage,
  fileFilter: fileFilter, // Assuming fileFilter is defined elsewhere
  limits: {
    fileSize: 1024 * 1024 * 40, // 200 MB limit for mapArt images (wtf)
  },
});

router.get('/gallery', async (req, res) => {
  res.render('mapart-gallery');
});

// MapArt route
router.get('/create', (req, res) => {
  res.render('mapart-create');
});

router.post('/create', mapArtUpload.single('file'), async (req, res) => {
  try {
    // Check if user is an admin and a moderator
    if (!res.locals.admin && !res.locals.mod) {
      return res.status(403).send('Forbidden');
    }

    let { name, description, artist, server, mapIds, tags } = req.body;
    let { filename, path, originalname } = req.file;

    if (!req.file) {
      // If no files are provided
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Generate the desired filename based on server
    const newFilename = await mapArtController.generateFilename(server);

    // Get current map count + 1
    const serverId = await mapArtController.getLatestServerIdByServer(server) + 1;
    
    console.log(path);
    console.log(filename);
    
    // Constructing the file path using path.join()
    const newFilepath = pathb.join(mapartDirectory, newFilename);
    
    
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

    mapIds = JSON.parse(mapIds);

    tags = JSON.parse(tags);

    const result = await mapArtController.createMapId({
      userId: res.locals.userId,
      username: res.locals.username,
      imgUrl: newFilename,
      name: name,
      description: description,
      mapIds: mapIds,
      tags: tags,
      artist: artist,
      displayName: displayName,
      hash: hash,
      server: server,
      serverId: serverId,
    });

    res.send(result);
  } catch (error) {
    console.error('Error creating map art:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/id/:id', async (req, res) => {
  try {
    let mapId = req.params.id;

    // Sanitize mapId
    mapId = validator.trim(mapId);
    mapId = validator.escape(mapId);

    res.render('mapart', { pageTitle: 'MapArt', mapId });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/edit/:id', async (req, res) => {
  try {
    let mapId = req.params.id;

    // Sanitize mapId
    mapId = validator.trim(mapId);
    mapId = validator.escape(mapId);

    const map = await mapArtController.getMapById(mapId);

    const user = await userController.getUserById(map.userId);

    res.render('mapart-edit', { map, user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/edit/:id', mapArtUpload.none(), async (req, res) => {
  try {
    // Check if user is an admin and a moderator
    if (!res.locals.admin && !res.locals.mod) {
      return res.status(403).send('Forbidden');
    }

    let mapId = req.params.id;
    let { artist, nsfw, name, description, tags  /* other fields as needed */ } = req.body;

    // Sanitize inputs
    const sanitizedArtist = validator.trim(artist);
    const sanitizedNsfw = validator.toBoolean(nsfw);
    const sanitizedName = validator.trim(name);
    const sanitizeDescription = validator.trim(description);
    tags = JSON.parse(tags);

    // Update map details, including MapArt data
    await mapArtController.updateMapById(mapId, {
      name: sanitizedName,
      artist: sanitizedArtist,
      nsfw: sanitizedNsfw,
      description: sanitizeDescription,
      tags: tags,
    });
    
    res.redirect(`/admin`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/uniqueUsernames', async (req, res) => {
  try {
    const uniqueUsernames = await mapArtController.getUniqueUsernames();
    res.json(uniqueUsernames);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/uniqueArtists', async (req, res) => {
  try {
    const uniqueArtists = await mapArtController.getUniqueArtists();
    res.json(uniqueArtists);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/uniqueServers', async (req, res) => {
  try {
    const uniqueServers = await mapArtController.getUniqueServers();
    res.json(uniqueServers);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/uniqueTags', async (req, res) => {
  try {
    const uniqueTags = await mapArtController.getUniqueTags();
    res.json(uniqueTags);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete mapArt route
router.get('/delete', async (req, res) => {
  try {
    let mapId = req.query.mapId || req.body.mapId;

    // Sanitize mapId
    mapId = validator.trim(mapId);
    mapId = validator.escape(mapId);

    const map = await mapArtController.getMapById(mapId);

    res.render('mapart-delete', { mapId, map });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/delete', async (req, res) => {
  try {
    // Check if user is an admin and a moderator
    if (!res.locals.admin && !res.locals.mod) {
      return res.status(403).send('Forbidden');
    }

    let mapId = req.query.mapId || req.body.mapId;

    // Sanitize mapId
    mapId = validator.trim(mapId);
    mapId = validator.escape(mapId);

    // Delete the map
    await mapArtController.deleteMapById(mapId);

    res.redirect('/admin');
  } catch (error) {
    console.error('Error deleting mapId:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;