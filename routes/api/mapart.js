const express = require('express');
const router = express.Router();
const mapArtController = require('../../controllers/mapArtController');
const duplicateCheckController = require('../../controllers/duplicateCheckController');

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
 *           enum: [nameAsc, nameDesc, dateAsc, dateDesc, mapIdsAsc, mapIdsDesc, random]
 *         description: Sorting criteria.
 *       - in: query
 *         name: seed
 *         schema:
 *           type: string
 *         description: Seed used to keep "random" sort order stable across pages (avoids duplicates when paginating).
 *     responses:
 *       200:
 *         description: Returns a list of maps with pagination, filtering, and sorting options. Empty array if none match.
 *     tags:
 *     - Map Art
 */
router.get('/maps', async (req, res) => {
  try {
    // Extract query parameters
    const { page, perPage, user, artist, sort, server, tag, collected, seed } = req.query;
    const userId = res.locals.userId;

    // Convert page and perPage to integers (if provided)
    const pageNumber = page ? parseInt(page) : undefined;
    const mapsPerPage = perPage ? parseInt(perPage) : undefined;

    // Fetch maps based on pagination, filtering, and sorting criteria
    const maps = await mapArtController.getMaps(pageNumber, mapsPerPage, user, artist, sort, server, tag, collected, userId, seed);

    // An empty array is a valid, successful response (e.g. requesting a page
    // past the end of the results) — not an error condition.
    return res.status(200).json(maps);
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
 *         description: Returns a list of MapArts missing metadata. Empty array if none match.
 *       401:
 *         description: Unauthorized.
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

    return res.status(200).json(maps);
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
 *         description: Returns a list of MapArts with no linked MapIds. Empty array if none match.
 *       401:
 *         description: Unauthorized.
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

    return res.status(200).json(maps);
  } catch (error) {
    console.error('Error fetching map arts missing map ids:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/mapArt/missingInfoCount:
 *   get:
 *     description: Returns the total count of MapArts missing metadata (moderator/admin only).
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [allbutdesc, all, name, artist, description, tags]
 *         description: Which kind of missing info to filter by.
 *     responses:
 *       200:
 *         description: Returns the total count of matching MapArts.
 *       401:
 *         description: Unauthorized.
 *     tags:
 *     - Map Art
 */
router.get('/missingInfoCount', async (req, res) => {
  try {
    if (!res.locals.admin && !res.locals.mod) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const count = await mapArtController.countMapsMissingInfo(req.query.type);
    return res.status(200).json(count);
  } catch (error) {
    console.error('Error counting maps missing info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/mapArt/missingRefsCount:
 *   get:
 *     description: Returns the total count of MapArts with no linked MapIds (moderator/admin only).
 *     responses:
 *       200:
 *         description: Returns the total count of matching MapArts.
 *       401:
 *         description: Unauthorized.
 *     tags:
 *     - Map Art
 */
router.get('/missingRefsCount', async (req, res) => {
  try {
    if (!res.locals.admin && !res.locals.mod) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const count = await mapArtController.countMapArtsMissingMapIds();
    return res.status(200).json(count);
  } catch (error) {
    console.error('Error counting map arts missing map ids:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/mapArt/duplicates/{id}:
 *   get:
 *     description: Runs duplicate-image checking for a MapArt (moderator/admin only).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MapArt to check.
 *       - in: query
 *         name: mode
 *         schema:
 *           type: string
 *           enum: [maparts, chunks, all]
 *         description: maparts = case 2 (vs all MapArts), chunks = case 4 (vs MapId chunks), all = case 6 (combined). Defaults to all.
 *       - in: query
 *         name: global
 *         schema:
 *           type: boolean
 *         description: If true, checks across all servers instead of just this MapArt's own server.
 *     responses:
 *       200:
 *         description: Returns the duplicate-check results.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: MapArt not found.
 *     tags:
 *     - Map Art
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
    if (mode === 'maparts') {
      result = await duplicateCheckController.checkMapArtVsMapArts(id, { global });
    } else if (mode === 'chunks') {
      result = await duplicateCheckController.checkMapArtVsMapIdChunks(id, { global });
    } else {
      result = await duplicateCheckController.checkMapArtAll(id, { global });
    }

    return res.status(200).json(result);
  } catch (error) {
    if (error.message === 'MapArt not found') {
      return res.status(404).json({ error: 'MapArt not found' });
    }
    console.error('Error checking mapart duplicates:', error);
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