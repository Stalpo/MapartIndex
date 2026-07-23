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
    const { page, perPage, user, artist, sort, server, tag, collected } = req.query;
    const userId = res.locals.userId;

    // Convert page and perPage to integers (if provided)
    const pageNumber = page ? parseInt(page) : undefined;
    const mapsPerPage = perPage ? parseInt(perPage) : undefined;

    // Fetch maps based on pagination, filtering, and sorting criteria
    const maps = await mapArtController.getMaps(pageNumber, mapsPerPage, user, artist, sort, server, tag, collected, userId);

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
 * /api/mapArt/missingInfo:
 *   get:
 *     description: Returns a paginated list of MapArts missing metadata (moderator/admin only).
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [allbutdesc, all, name, artist, description, tags]
 *         description: Which kind of missing info to filter by.
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
 *         description: Returns a list of MapArts missing metadata.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Maps not found.
 *     tags:
 *     - Map Art
 */
router.get('/missingInfo', async (req, res) => {
  try {
    if (!res.locals.admin && !res.locals.mod) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { type, page, perPage } = req.query;
    const pageNumber = page ? parseInt(page) : undefined;
    const mapsPerPage = perPage ? parseInt(perPage) : undefined;

    const maps = await mapArtController.fetchMapsMissingInfo(type, pageNumber, mapsPerPage);

    if (maps.length > 0) {
      return res.status(200).json(maps);
    } else {
      return res.status(404).json({ error: 'Maps not found' });
    }
  } catch (error) {
    console.error('Error fetching maps missing info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/mapArt/missingRefs:
 *   get:
 *     description: Returns a paginated list of MapArts with no linked MapIds (moderator/admin only).
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
 *         description: Returns a list of MapArts with no linked MapIds.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Maps not found.
 *     tags:
 *     - Map Art
 */
router.get('/missingRefs', async (req, res) => {
  try {
    if (!res.locals.admin && !res.locals.mod) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { page, perPage } = req.query;
    const pageNumber = page ? parseInt(page) : undefined;
    const mapsPerPage = perPage ? parseInt(perPage) : undefined;

    const maps = await mapArtController.fetchMapArtsMissingMapIds(pageNumber, mapsPerPage);

    if (maps.length > 0) {
      return res.status(200).json(maps);
    } else {
      return res.status(404).json({ error: 'Maps not found' });
    }
  } catch (error) {
    console.error('Error fetching map arts missing map ids:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/mapArt/mapscount:
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
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filter maps by tag.
 *     responses:
 *       200:
 *         description: Returns the count of maps with filtering.
 *       404:
 *         description: Maps not found.
 *     tags:
 *     - Map Art
 */
router.get('/mapscount', async (req, res) => {
  try {
    // Extract query parameters
    const { user, artist, server, tag, collected } = req.query;
    const userId = res.locals.userId;

    // Fetch maps based on pagination, filtering, and sorting criteria
    const maps = await mapArtController.countMapArts(user, artist, server, tag, collected, userId);

    return res.status(200).json(maps);
  } catch (error) {
    console.error('Error fetching maps count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/mapArt/randomMaps:
 *   get:
 *     description: Returns a random sample of maps drawn uniformly from the entire matching set (excluding NSFW maps).
 *     parameters:
 *       - in: query
 *         name: count
 *         schema:
 *           type: integer
 *         description: Number of random maps to return (default 20, max 100).
 *       - in: query
 *         name: server
 *         schema:
 *           type: string
 *         description: Filter maps by server.
 *     responses:
 *       200:
 *         description: Returns a random sample of maps.
 *     tags:
 *     - Map Art
 */
router.get('/randomMaps', async (req, res) => {
  try {
    const { count, server } = req.query;
    const sampleSize = Math.min(Math.max(parseInt(count) || 20, 1), 100);

    const maps = await mapArtController.getRandomMaps(sampleSize, server);
    res.status(200).json(maps);
  } catch (error) {
    console.error('Error fetching random maps:', error);
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