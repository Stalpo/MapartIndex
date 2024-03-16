const express = require('express');
const router = express.Router();
const mapArtController = require('../../controllers/mapArtController');
const userController = require('../../controllers/userController');
const fs = require("fs");
const sanitize = require('sanitize-filename');
const path = require('path');
const crypto = require("crypto");
const multer = require('multer');

/**
 * @swagger
 * /api/mapArt/{id}:
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
 *     - Map Art
 */
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const result = await mapArtController.getMapById(id);
  if(result) return res.status(result.error ? 400 : 200).json(result);
  res.status(404).json({error: 'Map id not found'});
});

module.exports = router;