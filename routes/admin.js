const express = require('express');
const router = express.Router();
const archiver = require('archiver');

// Required controllers
const userController = require('../controllers/userController');

router.get('/', async (req, res) => {
  try {
    const allUsers = await userController.getAllUsers();
    res.render('admin', { allUsers });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/download', (req, res) => {
  if (res.locals.admin) {
    const uploadDir = './public/uploads';
    const currentDate = new Date().toISOString().slice(0,10);
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' }).replace(/:/g, '-');
    const zipFileName = `uploads_${currentDate}_${currentTime}.zip`;
  
    const archive = archiver('zip', {
        zlib: { level: 9 } // Set compression level
    });
  
    archive.pipe(res);
    archive.directory(uploadDir, false);
    archive.finalize();
  
    res.attachment(zipFileName);
  } else {
    res.redirect('/admin');
  }
});

module.exports = router;