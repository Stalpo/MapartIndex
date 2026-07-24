const express = require('express');
const router = express.Router();
const mapIdController = require('../../controllers/mapIdController');
const userController = require('../../controllers/userController');
const fs = require("fs");
const crypto = require("crypto");
const multer = require('multer');
const imageHash = require('../../util/imageHash');
const duplicateCheckController = require('../../controllers/duplicateCheckController');

// Set up the storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/tmp'); // Upload files to a temporary directory
  },
  filename: function (req, file, cb) {
    // Generate a unique filename
    const filename = Date.now() + '-' + file.originalname;
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

// Init multer storage, file filter, and limits
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 64, // 64 KB limit
  },
});

/**
 * @swagger
 * /api/mapId/maps:
 *   get:
 *     description: Returns a list of maps with pagination, filtering, and sorting options.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination.
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *         description: Number of maps per page.
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: Filter maps by username.
 *       - in: query
 *         name: artist
 *         schema:
 *           type: string
 *         description: Filter maps by artist.
*       - in: query
 *         name: server
 *         schema:
 *           type: string
 *         description: Filter maps by server.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [nameAsc, nameDesc, dateAsc, dateDesc, random]
 *         description: Sorting criteria.
 *       - in: query
 *         name: seed
 *         schema:
 *           type: string
 *         description: Seed used to keep "random" sort order stable across pages (avoids duplicates when paginating).
 *     responses:
 *       200:
 *         description: Returns a list of maps with pagination, filtering, and sorting options.
 *       404:
 *         description: Maps not found.
 *     tags:
 *     - Map ID
 */
router.get('/maps', async (req, res) => {
  try {
    // Extract query parameters
    const { page, perPage, user, artist, sort, server, seed } = req.query;

    // Convert page and perPage to integers (if provided)
    const pageNumber = page ? parseInt(page) : undefined;
    const mapsPerPage = perPage ? parseInt(perPage) : undefined;

    // Fetch maps based on pagination, filtering, and sorting criteria
    const maps = await mapIdController.getMaps(pageNumber, mapsPerPage, user, artist, sort, server, seed);

    if (maps.length > 0) {
      return res.status(200).json(maps);
    } else {
      return res.status(404).json({ error: 'Maps not found' });
    }
  } catch (error) {
    console.error('Error fetching maps:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/mapId/missingRefs:
 *   get:
 *     description: Returns a paginated list of MapIds with no linked MapArt (moderator/admin only).
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination.
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *         description: Number of maps per page.
 *     responses:
 *       200:
 *         description: Returns a list of MapIds with no linked MapArt.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Maps not found.
 *     tags:
 *     - Map ID
 */
router.get('/missingRefs', async (req, res) => {
  try {
    if (!res.locals.admin && !res.locals.mod) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { page, perPage } = req.query;
    const pageNumber = page ? parseInt(page) : undefined;
    const mapsPerPage = perPage ? parseInt(perPage) : undefined;

    const maps = await mapIdController.fetchMapIdsMissingMapArt(pageNumber, mapsPerPage);

    if (maps.length > 0) {
      return res.status(200).json(maps);
    } else {
      return res.status(404).json({ error: 'Maps not found' });
    }
  } catch (error) {
    console.error('Error fetching map ids missing map art:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/mapId/missingRefsCount:
 *   get:
 *     description: Returns the total count of MapIds with no linked MapArt (moderator/admin only).
 *     responses:
 *       200:
 *         description: Returns the total count of matching MapIds.
 *       401:
 *         description: Unauthorized.
 *     tags:
 *     - Map ID
 */
router.get('/missingRefsCount', async (req, res) => {
  try {
    if (!res.locals.admin && !res.locals.mod) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const count = await mapIdController.countMapIdsMissingMapArt();
    return res.status(200).json(count);
  } catch (error) {
    console.error('Error counting map ids missing map art:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/mapId/duplicates/{id}:
 *   get:
 *     description: Runs duplicate-image checking for a MapId (moderator/admin only).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MapId to check.
 *       - in: query
 *         name: mode
 *         schema:
 *           type: string
 *           enum: [mapids, chunks, all]
 *         description: mapids = case 1 (vs all MapIds), chunks = case 3 (vs MapArt chunks), all = case 5 (combined). Defaults to all.
 *       - in: query
 *         name: global
 *         schema:
 *           type: boolean
 *         description: If true, checks across all servers instead of just this MapId's own server.
 *     responses:
 *       200:
 *         description: Returns the duplicate-check results.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: MapId not found.
 *     tags:
 *     - Map ID
 */
router.get('/duplicates/:id', async (req, res) => {
  try {
    if (!res.locals.admin && !res.locals.mod) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const mode = req.query.mode || 'all';
    const global = req.query.global === 'true';

    let result;
    if (mode === 'mapids') {
      result = await duplicateCheckController.checkMapIdVsMapIds(id, { global });
    } else if (mode === 'chunks') {
      result = await duplicateCheckController.checkMapIdVsMapArtChunks(id, { global });
    } else {
      result = await duplicateCheckController.checkMapIdAll(id, { global });
    }

    return res.status(200).json(result);
  } catch (error) {
    if (error.message === 'MapId not found') {
      return res.status(404).json({ error: 'MapId not found' });
    }
    console.error('Error checking mapid duplicates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/mapId/mapscount:
 *   get:
 *     description: Returns the count of maps with filtering.
 *     parameters:
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: Filter maps by username.
 *       - in: query
 *         name: artist
 *         schema:
 *           type: string
 *         description: Filter maps by artist.
*       - in: query
 *         name: server
 *         schema:
 *           type: string
 *         description: Filter maps by server.
 *     responses:
 *       200:
 *         description: Returns the count of maps with filtering.
 *       404:
 *         description: Maps not found.
 *     tags:
 *     - Map ID
 */
router.get('/mapscount', async (req, res) => {
  try {
    // Extract query parameters
    const { user, artist, server } = req.query;

    // Fetch maps based on pagination, filtering, and sorting criteria
    const maps = await mapIdController.countMaps(user, artist, server);

    return res.status(200).json(maps);
  } catch (error) {
    console.error('Error fetching maps count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/mapId/id/{id}:
 *   get:
 *     description: Returns a map defined by the id provided.
 *     responses:
 *       200:
 *         description: Returns a map defined by the id provided.
 *       404:
 *          description: Map not found.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The map id to search for.
 *     tags:
 *     - Map ID
 */
router.get('/id/:id', async (req, res) => {
  const id = req.params.id;
  const result = await mapIdController.getMapById(id)
  if(result) return res.status(result.error ? 400 : 200).json(result);
  res.status(404).json({error: 'Map not found'});
});

/**
 * @swagger
 * /api/mapId/owner/{id}:
 *   get:
 *     description: Returns a list of maps owned by the user id provided.
 *     responses:
 *       200:
 *         description: Returns a list of maps owned by the user id provided.
 *       404:
 *         description: Owner not found.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The owner id to search for.
 *     tags:
 *     - Map ID
 */
router.get('/owner/:id', async (req, res) => {
  const id = req.params.id;
  const result = await mapIdController.getMapsByOwnerId(id)
  if(result) return res.status(200).json(result);
  res.status(404).json({error: 'Owner not found'});
});

/**
 * @swagger
 * /api/mapId/hash/{hash}:
 *   get:
 *     description: Returns a map defined by the hash provided.
 *     responses:
 *       200:
 *         description: Returns a map defined by the hash provided.
 *       404:
 *         description: Map not found.
 *     parameters:
 *       - in: path
 *         name: hash
 *         schema:
 *           type: string
 *         description: The hash to search for.
 *     tags:
 *     - Map ID
 */
router.get('/hash/:hash', async (req, res) => {
  const hash = req.params.hash;
  const result = await mapIdController.getMapIdByHash(hash);
  if (result) return res.status(200).json(result);
  res.status(404).json({error: 'Map not found'});
});

/**
 * @swagger
 * /api/mapId/name/{name}:
 *   get:
 *     description: Returns a map defined by the name provided.
 *     responses:
 *       200:
 *         description: Returns a map defined by the name provided.
 *       404:
 *         description: Map not found.
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         description: The name to search for.
 *     tags:
 *     - Map ID
 */
router.get('/name/:name', async (req, res) => {
  const name = req.params.name; // Use req.params.name to get the parameter from the URL path
  const result = await mapIdController.getMapByDisplayName(name);
  if (result) return res.status(200).json(result);
  res.status(404).json({error: 'Map not found'});
});

/**
 * @swagger
 * /api/mapId/create:
 *   post:
 *     description: Uploads an image and creates a map id.
 *     parameters:
 *       - in: header
 *         name: X-API-Key
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *       - in: query
 *         name: server
 *         schema:
 *           type: string
 *         required: true
 *         description: The server name. (2b2t, constantium, etc)
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Upload successful.
 *       400:
 *         description: No file uploaded.
 *       401:
 *         description: Unauthorized.
 *       402:
 *         description: Duplicate encountered.
 *       500:
 *         description: Internal server error.
 *     tags:
 *     - Map ID
 */
router.post('/create', upload.single('image'), async (req, res) => {
  const apiKey = req.get("X-API-Key")

  try {
    if(!apiKey) return res.status(401).json({error: 'Unauthorized'});
    const user = await userController.getUserByApiKey(apiKey);
    if(!user) return res.status(401).json({error: 'Unauthorized'});


    if (!req.file) {
      // If no file is provided
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Metadata from req.file
    const { filename, path, size, mimetype } = req.file;

    // Generate the desired filename based on server
    const server = req.query.server;

    if (!server) {
      // If no server is provided
      return res.status(400).json({ error: 'No server was provided' });
    }

    const newFilename = await mapIdController.generateFilename(server);

    const serverId = await mapIdController.getLatestServerIdByServer(server) + 1;

    // Construct the new filepath manually
    const newFilepath = __dirname + '../../../public/uploads/' + newFilename;

    // Rename the file
    fs.renameSync(path, newFilepath);

    // Read the image file and convert it to base64
    const base64 = fs.readFileSync(newFilepath, { encoding: 'base64' });

    // Calculate a hash of the base64 data
    const hash = crypto.createHash('md5').update(base64).digest('hex');

    // Hash of the raw decoded pixels, used by the duplicate-check tooling on the edit pages
    const pixelHash = await imageHash.hashMapIdImage(newFilepath);

    // Add metadata to the db
    const map = await mapIdController.createMapId({
      userId: user.id,
      username: user.username,
      imgUrl: newFilename,
      hash: hash,
      pixelHash: pixelHash,
      server: server,
      serverId: serverId,
    });
    // Send a response with information about the uploaded file
    res.status(200).json({ message: 'Upload successful', data: map });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/mapId/{id}:
 *   delete:
 *     description: Deletes a map and its corresponding entry in the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The id of the map to delete.
 *       - in: header
 *         name: X-API-Key
 *         description: The user's API key.
 *         schema:
 *          type: string
 *          format: uuid
 *          required: true
 *     responses:
 *       200:
 *         description: Map and entry deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Map id not found.
 *       500:
 *         description: Internal server error.
 *     tags:
 *     - Map ID
 */
router.delete('/:id', async (req, res) => {
  try {
    // API Key from header
    const apiKey = req.get("X-API-Key");

    if (!apiKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Does users API Key exist
    const user = await userController.getUserByApiKey(apiKey);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Which mapId are we deleting
    const mapId = req.params.id;

    // Retrieve map information from the database
    const map = await mapIdController.getMapById(mapId);

    if (!map) {
      return res.status(404).json({ error: 'Map id not found' });
    }

    // Check if the user is authorized to delete the map
    if (map.user.id !== user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Don't allow deletion while a map art is still associated with this map id
    if (map.mapId) {
      return res.status(400).json({ error: 'This map id has an associated map art and cannot be deleted.' });
    }

    // Delete the file from the 'public/uploads' directory
    const filePath = `public/uploads/${map.imgUrl}`;
    fs.unlinkSync(filePath);

    // Delete the entry from the database
    await mapIdController.deleteMapById(mapId);

    res.status(200).json({ message: 'Map and entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting map and entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;