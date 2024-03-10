const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const profileController = require('../../controllers/profileController');

/**
 * @swagger
 * /api/user/maps:
 *   get:
 *     description: Returns a list of map ids owned by the user.
 *     parameters:
 *     - in: user-id
 *     name: user-id
 *     type: string
 *     required: true
 *     responses:
 *       200:
 *         description: Returns a list of map ids.
 *       404:
 *         description: User id not found.
 *     tags:
 *     - User
 */

router.get('/maps', async (req, res) => {
  const userId = req.query.userId;
  const result = await profileController.getAllMapsForUserId(userId);
  if (result) return res.status(200).json(result);
  res.status(404).json({ error: 'Map ids not found' });
});

module.exports = router;