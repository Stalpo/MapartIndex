const express = require('express');
const router = express.Router();
const mapIdController = require('../../controllers/mapIdController');
const userController = require('../../controllers/userController');
const fs = require("fs");
const sanitize = require('sanitize-filename');
const path = require('path');
const crypto = require("crypto");
const multer = require('multer');

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
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [nameAsc, nameDesc, dateAsc, dateDesc]
 *         description: Sorting criteria.
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
        const { page, perPage, user, artist, sort } = req.query;

        // Convert page and perPage to integers (if provided)
        const pageNumber = page ? parseInt(page) : undefined;
        const mapsPerPage = perPage ? parseInt(perPage) : undefined;

        // Fetch maps based on pagination, filtering, and sorting criteria
        const maps = await mapIdController.getMaps(pageNumber, mapsPerPage, user, artist, sort);

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
 * /api/mapId/{id}:
 *   get:
 *     description: Returns a map defined by the id provided.
 *     responses:
 *       200:
 *         description: Returns a map defined by the id provided.
 *       404:
 *          description: Map id not found.
 *     parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           description: The user id to search for
 *     tags:
 *     - Map ID
 */
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const result = await mapIdController.getMapById(id)
    if(result) return res.status(result.error ? 400 : 200).json(result);
    res.status(404).json({error: 'Map id not found'});
});

/**
 * @swagger
 * /api/mapId/owner:
 *   get:
 *     description: Returns a list of maps owned by the user id provided.
 *     responses:
 *       200:
 *         description: Returns a list of maps owned by the user id provided.
 *       404:
 *         description: Owner id not found.
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: The owner id to search for
 *     tags:
 *     - Map ID
 */
router.get('/owner', async (req, res) => {
    const id = req.query.id;
    const result = await mapIdController.getMapsByOwnerId(id)
    if(result) return res.status(200).json(result);
    res.status(404).json({error: 'Owner id not found'});
});

/**
 * @swagger
 * /api/mapId/hash:
 *   get:
 *     description: Returns a map defined by the hash provided.
 *     responses:
 *       200:
 *         description: Returns a map defined by the hash provided.
 *       404:
 *         description: Map id not found.
 *     parameters:
 *       - in: query
 *         name: hash
 *         schema:
 *           type: string
 *         description: The hash to search for
 *     tags:
 *     - Map ID
 */
router.get('/hash', async (req, res) => {
    const hash = req.query.hash;
    const result = await mapIdController.getMapIdByHash(hash);
    if (result) return res.status(200).json(result);
    res.status(404).json({error: 'Map id not found'});
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

        // Construct the new filepath manually
        const newFilepath = __dirname + '../../../public/uploads/' + newFilename;

        // Rename the file
        fs.renameSync(path, newFilepath);

        // Read the image file and convert it to base64
        const base64 = fs.readFileSync(newFilepath, { encoding: 'base64' });

        // Calculate a hash of the base64 data
        const hash = crypto.createHash('md5').update(base64).digest('hex');

        // Add metadata to the db
        const map = await mapIdController.createMapId({
            userId: user.id,
            username: user.username,
            imgUrl: newFilename,
            hash: hash,
            server: server,
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