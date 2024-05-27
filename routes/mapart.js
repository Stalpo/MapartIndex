const express = require('express');
const router = express.Router();
const validator = require('validator');
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');

// Required controllers
const userController = require('../controllers/userController');
const mapArtController = require('../controllers/mapArtController');
const serverController = require('../controllers/serverController');

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
  let server = "";
  if(req.subdomains.length != 0){
    server = req.subdomains[0];
  }
  if(req.subdomains.length == 0 || server === "www"){
    res.render('mapart-gallery');
  }else{
    const { displayName } = await serverController.getServerByName(server);
    res.render('mapart-gallery', { server, displayName });
  }
});

// MapArt route
router.get('/create', async (req, res) => {
  let server = "";
  if(req.subdomains.length != 0){
    server = req.subdomains[0];
  }
  if(req.subdomains.length == 0 || server === "www"){
    res.render('mapart-create');
  }else{
    res.render('mapart-create', { server });
  }
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

    const { name, description, artist, server, mapIds, width, height, tags, nsfw } = req.body;
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
    const parsedTags = JSON.parse(tags.toLowerCase());

    let nsfwBool = false;
    if(nsfw === "true"){
      nsfwBool = true;
    }

    const result = await mapArtController.createMapId({
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
      nsfw: nsfwBool,
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
    let userId = res.locals.userId;

    // Sanitize mapId
    mapId = validator.trim(mapId);
    mapId = validator.escape(mapId);

    const map = await mapArtController.getMapById(mapId);

    if (!map) {
      return res.render('404');
    }

    mapArtController.incrementMapViews(mapId);

    res.render('mapart', { pageTitle: 'MapArt', mapId, userId });
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

    if (!map) {
      return res.render('404');
    }

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

router.get('/favorite/:id', async (req, res) => {
  try {
    const mapId = req.params.id;
    const userId = res.locals.userId;

    // Check if the mapId is a favorite for the user
    const isFavorite = await mapArtController.isMapArtFavorite(userId, mapId);

    res.status(200).json({ isFavorite: isFavorite });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/favorite/:id', async (req, res) => {
  try {
    const mapId = req.params.id;
    const userId = res.locals.userId;

    // Sanitize mapId
    const sanitizedMapId = validator.escape(validator.trim(mapId));

    // Add favorite
    await mapArtController.setFavoriteMapArtId(userId, sanitizedMapId);

    res.status(200).send('Favorite added successfully');
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/favorite/:id', async (req, res) => {
  try {
    const mapId = req.params.id;
    const userId = res.locals.userId;

    // Sanitize mapId
    const sanitizedMapId = validator.escape(validator.trim(mapId));

    // Remove favorite
    await mapArtController.removeFavoriteMapArtId(userId, sanitizedMapId);

    res.status(200).send('Favorite removed successfully');
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/like/:id', async (req, res) => {
  try {
    const mapId = req.params.id;
    const userId = res.locals.userId;

    // Call controller function to add like
    const updatedMapArt = await mapArtController.likeMapArtId(userId, mapId);

    res.status(200).json({ message: 'Like added successfully', mapArt: updatedMapArt });
  } catch (error) {
    console.error('Error adding like:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/like/:id', async (req, res) => {
  try {
    const mapId = req.params.id;
    const userId = res.locals.userId;

    // Call controller function to remove like
    const updatedMapArt = await mapArtController.unlikeMapArtId(userId, mapId);

    res.status(200).json({ message: 'Like removed successfully', mapArt: updatedMapArt });
  } catch (error) {
    console.error('Error removing like:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/like/:id', async (req, res) => {
  try {
    const mapId = req.params.id;
    const userId = res.locals.userId;

    // Call controller function to check if mapArtId is liked by userId
    const isLiked = await mapArtController.isMapArtIdLiked(userId, mapId);

    res.status(200).json({ isLiked });
  } catch (error) {
    console.error('Error checking if mapArt is liked:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/missingInfo', async (req, res) => {
  try {
    const type = req.query.type;
    const missingInfo = await mapArtController.fetchMapsMissingInfo(type);
    res.render('mapart-missing', { missingInfo, type: type || 'all' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
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