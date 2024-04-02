const express = require('express');
const router = express.Router();

// Required controllers
const mapSearchController = require('../controllers/mapSearchController');

// Searching maps route
router.get('/', async (req, res, next) => {
    let results = await mapSearchController.searchMaps(req, res, next);
    results = JSON.parse(results);
    res.render('search', { results });
});

module.exports = router;