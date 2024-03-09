const express = require('express');
const router = express.Router();
const mapIdController = require('../../controllers/mapIdController');
/**
 * @swagger
 * /mapId/maps:
 *   get:
 *     description: Returns a list of map ids.
 *     responses:
 *       200:
 *         description: Returns a list of map ids.
 */
router.get('/maps', async (req, res) => {
    const result = await mapIdController.getAllMapIds();
    if (result) return res.status(200).json(result);
    return res.status(404).json({ error: 'Map ids not found' });
});

/**
 * @swagger
 * /mapId/id:
 *   get:
 *     description: Returns a map defined by the id provided.
 *     responses:
 *       200:
 *         description: Returns a map defined by the id provided.
 *     parameters:
 *     - in: string
 *     name: id
 */
router.get('/id', async (req, res) => {
    const id = req.query.id;
    const result = await mapIdController.getMapIdById(id);
    if(result) return res.status(result.error ? 400 : 200).json(result);
    return res.status(404).json({error: 'Map id not found'});
});
/**
 * @swagger
 * /mapId/owner:
 *   get:
 *     description: Returns the maps owned by the id provided.
 *     responses:
 *       200:
 *         description: Returns the maps owned by the id provided.
 *     parameters:
 *     - in: string
 *     name: id
 */
router.get('/owner', async (req, res) => {
    const id = req.query.id;
    const result = await mapIdController.getMapsByOwnerId(id)
    if(result) return res.status(200).json(result);
    return res.status(404).json({error: 'Owner id not found'});
});

/**
 * @swagger
 * /mapId/hash:
 *   get:
 *     description: Returns a map defined by the hash provided.
 *     responses:
 *       200:
 *         description: Returns a map defined by the hash provided.
 *     parameters:
 *     - in: string
 *     name: hash
 */
router.get('/hash', async (req, res) => {
    const hash = req.query.hash;
    const result = await mapIdController.getMapIdByHash(hash);
    if (result) return res.status(200).json(result);
    return res.status(404).json({error: 'Map id not found'});
});

/**
 * @swagger
 * /mapId/create:
 *   post:
 *     description: Create a map id.
 *
 *     parameters:
 *      - in: body
 *      name: data
 *      type: raw
 *
 *      - in: header
 *      name: x-access-token
 *      type: string
 *      description: Access token for the user
 *      required: true
 */
router.post('/create', async (req, res) => {
    const data = req.body;
    const access = req.headers['x-access-token'];

    //const result = await mapIdController.createMapId({creatorId, mapId, imgUrl, data, hash});
    //TODO: convert data to image and create the map id :D check for duplicates too
    // also add a way to check the access token
    return res.status(201).json("not implemented");
});
module.exports = router;