const express = require('express');
const router = express.Router();
const mapArtController = require('../../controllers/mapArtController');

/**
 * @swagger
 * /api/mapArt/maps:
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
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filter maps by tag.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [nameAsc, nameDesc, dateAsc, dateDesc, mapIdsAsc, mapIdsDesc]
 *         description: Sorting criteria.
 *     responses:
 *       200:
 *         description: Returns a list of maps with pagination, filtering, and sorting options.
 *       404:
 *         description: Maps not found.
 *     tags:
 *     - Map Art
 */
router.get('/maps', async (req, res) => {
  try {
      // Extract query parameters
      const { page, perPage, user, artist, sort, server, tag } = req.query;

      // Convert page and perPage to integers (if provided)
      const pageNumber = page ? parseInt(page) : undefined;
      const mapsPerPage = perPage ? parseInt(perPage) : undefined;

      // Fetch maps based on pagination, filtering, and sorting criteria
      const maps = await mapArtController.getMaps(pageNumber, mapsPerPage, user, artist, sort, server, tag);

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