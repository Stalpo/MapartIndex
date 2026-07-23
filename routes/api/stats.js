const express = require('express');
const router = express.Router();
const mapIdController = require('../../controllers/mapIdController');
const mapArtController = require('../../controllers/mapArtController');
const serverController = require('../../controllers/serverController');
const visitController = require('../../controllers/visitController');
const userController = require('../../controllers/userController');

/**
 * @swagger
 * /api/stats:
 *   get:
 *     description: Returns homepage statistics, optionally scoped to a server subdomain.
 *     parameters:
 *       - in: query
 *         name: server
 *         schema:
 *           type: string
 *         description: Server subdomain to scope statistics to.
 *     responses:
 *       200:
 *         description: Returns homepage statistics.
 *     tags:
 *     - Stats
 */
router.get('/', async (req, res) => {
  try {
    const { server } = req.query;

    if (!server) {
      const [totalMaps, totalMaparts, servers, totalVisits, dailyVisits, users, dailyUsers] = await Promise.all([
        mapIdController.countMapIds(),
        mapArtController.countAllMapArts(),
        mapIdController.getUniqueServers(),
        visitController.countVisits(),
        visitController.countDailyVisits(),
        userController.getAllUsers(),
        visitController.countDailyUserVisits(),
      ]);

      return res.json({
        totalMaps,
        totalMaparts,
        totalServers: servers.length,
        totalVisits,
        dailyVisits,
        totalUsers: users.length,
        dailyUsers,
      });
    }

    const [totalMaps, totalMaparts, serverObj, totalVisits, dailyVisits, totalUsers, dailyUsers] = await Promise.all([
      mapIdController.countMapIdsByServer(server),
      mapArtController.countMapIdsByServer(server),
      serverController.getServerByName(server),
      visitController.countVisitsByServer(server),
      visitController.countDailyVisitsByServer(server),
      visitController.countUserVisitsByServer(server),
      visitController.countDailyUserVisitsByServer(server),
    ]);

    res.json({
      totalMaps,
      totalMaparts,
      totalVisits,
      dailyVisits,
      totalUsers,
      dailyUsers,
      displayName: serverObj ? serverObj.displayName : server,
      discord: serverObj ? serverObj.discord : null,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
