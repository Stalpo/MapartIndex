const express = require('express');
const router = express.Router();
const validator = require('validator');
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');

// Required controllers
const serverController = require('../controllers/serverController');

// Multer config
const serverUpload = multer({
  dest: '/public/uploads/server/tmp', // Destination folder for uploaded files
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only PNG images are allowed!'), false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 40, // 40 MB limit for server images
  },
});

// server route
router.get('/create', async (req, res) => {
  res.render('server-create');
});
  
router.post('/create', serverUpload.single('file'), async (req, res) => {
  try {
    if (!res.locals.admin) {
      return res.status(403).send('Forbidden');
    }

    if (!req.file) {
      console.log('No file uploaded:', req.body);
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const { name, description, artist, server, mapIds, width, height, tags } = req.body;
    const { filename, path, originalname } = req.file;

    const newFilename = await serverController.generateFilename(server);
    const serverId = await serverController.getLatestServerIdByServer(server) + 1;
    const newFilepath = `${res.locals.filepath}/public/uploads/server/${newFilename}`;

    let displayName = newFilename.endsWith(".png") ? newFilename.slice(0, -4) : undefined;

    if (!path) {
      return res.status(400).json({ error: 'File path missing' });
    }

    fs.renameSync(path, newFilepath);

    const base64 = fs.readFileSync(newFilepath, { encoding: 'base64' });
    const hash = crypto.createHash('md5').update(base64).digest('hex');

    const parsedMapIds = JSON.parse(mapIds);
    const parsedTags = JSON.parse(tags);

    const result = await serverController.createMapId({
      userId: res.locals.userId,
      username: res.locals.username,
      imgUrl: newFilename,
      name,
      description,
      mapIds: parsedMapIds,
      width: parseInt(width),
      height: parseInt(height),
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

router.get('/edit/:id', async (req, res) => {
  try {
    let mapId = req.params.id;

    // Sanitize mapId
    mapId = validator.trim(mapId);
    mapId = validator.escape(mapId);

    const map = await serverController.getMapById(mapId);

    if (!map) {
      return res.render('404');
    }

    const user = await userController.getUserById(map.userId);
    
    res.render('server-edit', { map, user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/edit/:id', serverUpload.none(), async (req, res) => {
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

    // Update map details, including server data
    await serverController.updateMapById(mapId, {
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

module.exports = router;