const express = require('express');
const router = express.Router();
const validator = require('validator');

const profileController = require('../../controllers/profileController');

/**
 * @swagger
 * /api/user/maps:
 *   get:
 *     description: Returns a list of map ids owned by the user.
 *     parameters:
 *     - in: query
 *       name: userId
 *       type: string
 *       required: true
 *     responses:
 *       200:
 *         description: Returns a list of map ids.
 *       404:
 *         description: User id not found.
 *     tags:
 *     - User
 */

router.get('/maps', async (req, res) => {
  let { userId } = req.query;
  userId = validator.trim(validator.escape(userId)); // Sanitize userId
  const result = await profileController.getAllMapsForUserId(userId);
  if (result) return res.status(200).json(result);
  res.status(404).json({ error: 'Map ids not found' });
});

/**
 * @swagger
 * /api/user/{id}:
 *  get:
 *    description: Returns a user profile defined by the id provided.
 *    parameters:
 *      - in: path
 *        name: id
 *        type: string
 *        format: uuid
 *        required: true
 *        description: The user id to search for
 *    responses:
 *      200:
 *        description: Returns a user profile defined by the id provided.
 *      404:
 *        description: User id not found.
 *    tags:
 *      - User
 */
router.get("/:id", async (req, res) => {
    let { id } = req.params;
    id = validator.trim(validator.escape(id)); // Sanitize id
    const result = await profileController.getProfileById(id);
    if (result) return res.status(200).json(result);
    res.status(404).json({ error: "User id not found" });
});

module.exports = router;
