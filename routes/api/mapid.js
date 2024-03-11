const express = require('express');
const router = express.Router();
const mapIdController = require('../../controllers/mapIdController');
const userController = require('../../controllers/userController');
const fs = require("fs");
const crypto = require("crypto");
const multer = require('multer');

// Set up the storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(16, (err, buffer) => {
            if (err) return cb(err);

            const hash = buffer.toString('hex');
            const sanitizedFilename = sanitize(file.originalname);
            const filename = `${hash}${path.extname(sanitizedFilename)}`;

            cb(null, filename);
        });
    },
});

// File filter for multer
const fileFilter = (req, file, cb) => {
    // Check if the file is an image
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed!'), false);
    }
};

// Init multer storage, file filter, and limits
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 2, // 2 MB limit
    },
});

/**
 * @swagger
 * /api/mapId/maps:
 *   get:
 *     description: Returns a list of map ids.
 *     responses:
 *       200:
 *         description: Returns a list of map ids.
 *     tags:
 *     - Map ID
 */
router.get('/maps', async (req, res) => {
    const result = await mapIdController.getAllMaps();
    if (result) return res.status(200).json(result);
    res.status(404).json({ error: 'Map ids not found' });
});

/**
 * @swagger
 * /api/mapId/id:
 *   get:
 *     description: Returns a map defined by the id provided.
 *     responses:
 *       200:
 *         description: Returns a map defined by the id provided.
 *       404:
 *          description: Map id not found.
 *     parameters:
 *         - in: query
 *           name: id
 *           schema:
 *             type: string
 *           description: The user id to search for
 *     tags:
 *     - Map ID
 */
router.get('/id', async (req, res) => {
    const id = req.query.id;
    const result = await mapIdController.getMapIdById(id);
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
 *     requestBody:
 *       content:
 *         img/png:
 *           schema:
 *             type: string
 *             format: binary
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
 *       500:
 *         description: Internal server error.
 *     tags:
 *     - Map ID
 */
router.post('/create', upload.single('image'), async (req, res) => {
    const apiKey = req.get("X-API-Key")
    console.log(req.file)
    //TODO: figure out why req.file is undefined
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

        // Read the image file and convert it to base64
        const base64 = fs.readFileSync(path, { encoding: 'base64' });

        // Calculate a hash of the base64 data
        const hash = crypto.createHash('md5').update(base64).digest('hex');

        // Add metadata to the db
        await mapIdController.createMapId({
            userId: user.id,
            imgUrl: filename,
            hash: hash
        });
        // Send a response with information about the uploaded file
        res.status(200).json({ message: 'Upload successful', filename: filename });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router;