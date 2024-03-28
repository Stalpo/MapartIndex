const express = require('express');
const router = express.Router();
const validator = require('validator');
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');

// Required controllers
const userController = require('../controllers/userController');
const mapArtController = require('../controllers/mapArtController');

// Multer config
const mapArtUpload = multer({
  dest: '/public/uploads/mapart/tmp', // Destination folder for uploaded files
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
  res.render('mapart-gallery');
});

// MapArt route
router.get('/create', async (req, res) => {
  res.render('mapart-create');
});

router.post('/create', mapArtUpload.single('file'), async (req, res) => {
  try {
    if (!res.locals.admin && !res.locals.mod) {
      return res.status(403).send('Forbidden');
    }

    if (!req.file) {
      console.log('No file uploaded:', req.body);
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const { name, description, artist, server, mapIds, tags } = req.body;
    const { filename, path, originalname } = req.file;

    const newFilename = await mapArtController.generateFilename(server);
    const serverId = await mapArtController.getLatestServerIdByServer(server) + 1;
    const newFilepath = `${res.locals.filepath}/public/uploads/mapart/${newFilename}`;

    let displayName = newFilename.endsWith(".png") ? newFilename.slice(0, -4) : undefined;

    if (!path) {
      return res.status(400).json({ error: 'File path missing' });
    }

    fs.renameSync(path, newFilepath);

    const base64 = fs.readFileSync(newFilepath, { encoding: 'base64' });
    const hash = crypto.createHash('md5').update(base64).digest('hex');

    const parsedMapIds = JSON.parse(mapIds);
    const parsedTags = JSON.parse(tags);

    const result = await mapArtController.createMapId({
      userId: res.locals.userId,
      username: res.locals.username,
      imgUrl: newFilename,
      name,
      description,
      mapIds: parsedMapIds,
      tags: parsedTags,
      artist,
      displayName,
      hash,
      server,
      serverId,
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

    mapArtController.incrementMapViews(id);

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