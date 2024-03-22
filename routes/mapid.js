const express = require('express');
const router = express.Router();
const validator = require('validator');
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');

// Required controllers
const userController = require('../controllers/userController');
const mapIdController = require('../controllers/mapIdController');

// Multer config
const mapIdUpload = multer({
  dest: '/public/uploads/tmp', // Destination folder for uploaded files
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only PNG images are allowed!'), false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 40, // 40 MB limit for mapArt images
  },
});

router.get('/gallery', async (req, res) => {
  res.render('mapid-gallery');
});

router.get('/create', async (req, res) => {
  res.render('mapid-create');
});

router.post('/create', mapIdUpload.array('images', 4000), async (req, res) => {
  try {
    // Check if user is an admin and a moderator
    if (!res.locals.admin && !res.locals.mod) {
      return res.status(403).send('Forbidden');
    }

    const { files } = req;

    if (!files || files.length === 0) {
      // If no files are provided
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedFiles = [];

    // Process each file
    for (const file of files) {
      const { filename, path, originalname } = file;

      // Generate the desired filename based on server
      const server = req.body.server;
      const newFilename = await mapIdController.generateFilename(server);

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
    // Send a response with information about the uploaded files
    res.status(200).json({ message: 'Upload successful', files: uploadedFiles[0] });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/id/:id', async (req, res) => {
  try {
    let mapId = req.params.id;

    // Sanitize mapId
    mapId = validator.trim(mapId);
    mapId = validator.escape(mapId);

    res.render('mapid', { pageTitle: 'MapId', mapId });
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

    const map = await mapIdController.getMapById(mapId);

    const user = await userController.getUserById(map.userId);

    res.render('mapid-edit', { pageTitle: 'Edit MapId', map, user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/edit/:id', mapIdUpload.none(), async (req, res) => {
  try {
    // Check if user is an admin and a moderator
    if (!res.locals.admin && !res.locals.mod) {
      return res.status(403).send('Forbidden');
    }

    const mapId = req.params.id;
    const { artist, nsfw /* Add other fields as needed */ } = req.body;

    // Sanitize inputs
    const sanitizedArtist = validator.trim(artist);
    const sanitizedNsfw = validator.toBoolean(nsfw);

    // Update map details, including MapArt data
    await mapIdController.updateMapById(mapId, {
      artist: sanitizedArtist,
      nsfw: sanitizedNsfw,
    });
    
    res.redirect(`/admin`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/delete', async (req, res) => {
  try {
    let mapId = req.query.mapId || req.body.mapId;

    // Sanitize mapId
    mapId = validator.trim(mapId);
    mapId = validator.escape(mapId);

    const map = await mapIdController.getMapById(mapId);

    res.render('mapid-delete', { mapId, map });
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
    await mapIdController.deleteMapById(mapId);

    res.redirect('/admin');
  } catch (error) {
    console.error('Error deleting mapId:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/uniqueUsernames', async (req, res) => {
  try {
    const uniqueUsernames = await mapIdController.getUniqueUsernames();
    res.json(uniqueUsernames);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/uniqueArtists', async (req, res) => {
  try {
    const uniqueArtists = await mapIdController.getUniqueArtists();
    res.json(uniqueArtists);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/uniqueServers', async (req, res) => {
  try {
    const uniqueServers = await mapIdController.getUniqueServers();
    res.json(uniqueServers);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;