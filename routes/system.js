const express = require('express');
const router = express.Router();

// Required controllers
const systemController = require('../controllers/systemController');

// Searching maps route
router.get('/update', async (req, res) => {
  try {
    if (res.locals.admin) {
      const updateResult = await systemController.runGitPull(req, res);
      res.json(updateResult);
    } else {
      res.status(403).send('Forbidden');
    }
  } catch (error) {
    console.error('Error during system update:', error);
    res.status(500).json({ error: 'System update failed', details: error.message });
  }
});

module.exports = router;