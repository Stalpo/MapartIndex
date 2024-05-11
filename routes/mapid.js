const express = require('express');
const router = express.Router();
const validator = require('validator');
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');
const getPixels = require("get-pixels")

// Required controllers
const userController = require('../controllers/userController');
const mapIdController = require('../controllers/mapIdController');

// Multer config
const mapIdUpload = multer({
  dest: '/public/uploads/tmp', // Destination folder for uploaded files
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only PNG images are allowed!'), false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 40, // 40 MB limit for mapArt images
  },
});

// get all image data for duplicate checking
const checkImgDatas = [];

fs.readdir(`${__dirname.slice(0, -7)}/public/uploads`, function (err, files) {
  //handling error
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  } 
  //listing all files using forEach
  files.forEach(function (file) {
    // Do whatever you want to do with the file
    if(file === "mapart" || file === "tmp" || file === ".placeholder"){
      
    }else{
      loadImg(`${__dirname.slice(0, -7)}/public/uploads/${file}`).then(data => {
        if(!(data == null)){
          checkImgDatas.push({
            data: data,
            name: file
          }); 
        }
      });
    }
  });
});

router.get('/gallery', async (req, res) => {
  res.render('mapid-gallery');
});

router.get('/create', async (req, res) => {
  res.render('mapid-create');
});

router.post('/create', mapIdUpload.array('images', 4000), async (req, res) => {
  try {
    // Check if user is an admin and a moderator
    if (!res.locals.admin && !res.locals.mod) {
      return res.status(403).send('Forbidden');
    }

    const { files, maxWrong } = req;

    if (!files || files.length === 0) {
      // If no files are provided
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedFiles = [];

    // Process each file
    for (const file of files) {
      const { filename, path, originalname } = file;

      // Generate the desired filename based on server
      const server = req.body.server;
      const newFilename = await mapIdController.generateFilename(server);

      // Get current map count + 1
      const serverId = await mapIdController.getLatestServerIdByServer(server) + 1;
      const newFilepath = `${res.locals.filepath}/public/uploads/${newFilename}`;

      let displayName;
      if (newFilename.endsWith(".png")) {
        displayName = newFilename.slice(0, -4);
      }

      // Rename the file
      fs.renameSync(path, newFilepath);

      // check if duplicate
      let imgData = await loadImg(newFilepath);
      let duplicateOf = isDuplicate(imgData, 10);
      console.log(duplicateOf);
      if(duplicateOf != null){
        return res.status(500).json({ error: `${originalname} is a duplicate of ${duplicateOf}` });
      }

      // add to checkImgs
      checkImgDatas.push({
        data: imgData,
        name: newFilename
      });

      // Read the image file and convert it to base64
      const base64 = fs.readFileSync(newFilepath, { encoding: 'base64' });

      // Calculate a hash of the base64 data
      const hash = crypto.createHash('md5').update(base64).digest('hex');

      // Add metadata to the db
      await mapIdController.createMapId({
        userId: res.locals.userId,
        username: res.locals.username,
        imgUrl: newFilename,
        displayName: displayName,
        hash: hash,
        server: req.body.server,
        serverId: serverId,
      });

      uploadedFiles.push({
        originalname,
        filename: newFilename,
        path: newFilepath
      });
    }
    // Send a response with information about the uploaded files
    res.status(200).json({ message: 'Upload successful', files: uploadedFiles[0] });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function loadImg(path) {
  return new Promise((resolve, reject) => {
    getPixels(path, function(err, data) {
      if(err) {
        reject(err)
      } else {
        resolve(data);
      }
    })
  });
}

function isDuplicate(imgData, maxWrong){
  let dupName = null;
  checkImgDatas.forEach(checkImgData => {
    let wrong = 0;

    for(let x = 0; x < 128; x++){
      for(let y = 0; y < 128; y++){
        if(!(checkImgData.data.get(x, y, 0) == imgData.get(x, y, 0) && checkImgData.data.get(x, y, 1) == imgData.get(x, y, 1) && checkImgData.data.get(x, y, 2) == imgData.get(x, y, 2) && checkImgData.data.get(x, y, 3) == imgData.get(x, y, 3))){
          wrong++;
          if(wrong > maxWrong){
            continue;
          }
        }
      }
    }
    dupName = checkImgData.name;
  });
  return dupName;
}

router.get('/id/:id', async (req, res) => {
  try {
    let mapId = req.params.id;

    // Sanitize mapId
    mapId = validator.trim(mapId);
    mapId = validator.escape(mapId);

    const map = await mapIdController.getMapById(mapId);

    if (!map) {
      return res.render('404');
    }
    
    mapIdController.incrementMapViews(mapId);

    res.render('mapid', { pageTitle: 'MapId', mapId });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/edit/:id', async (req, res) => {
  try {
    let mapId = req.params.id;

    // Sanitize mapId
    mapId = validator.trim(mapId);
    mapId = validator.escape(mapId);

    const map = await mapIdController.getMapById(mapId);

    if (!map) {
      return res.render('404');
    }

    const user = await userController.getUserById(map.userId);

    res.render('mapid-edit', { pageTitle: 'Edit MapId', map, user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/edit/:id', mapIdUpload.none(), async (req, res) => {
  try {
    // Check if user is an admin and a moderator
    if (!res.locals.admin && !res.locals.mod) {
      return res.status(403).send('Forbidden');
    }

    const mapId = req.params.id;
    const { artist, nsfw /* Add other fields as needed */ } = req.body;

    // Sanitize inputs
    const sanitizedArtist = validator.trim(artist);
    const sanitizedNsfw = validator.toBoolean(nsfw);

    // Update map details, including MapArt data
    await mapIdController.updateMapById(mapId, {
      artist: sanitizedArtist,
      nsfw: sanitizedNsfw,
    });
    
    res.redirect(`/admin`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/delete', async (req, res) => {
  try {
    let mapId = req.query.mapId || req.body.mapId;

    // Sanitize mapId
    mapId = validator.trim(mapId);
    mapId = validator.escape(mapId);

    const map = await mapIdController.getMapById(mapId);

    res.render('mapid-delete', { mapId, map });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/delete', async (req, res) => {
  try {
    // Check if user is an admin and a moderator
    if (!res.locals.admin && !res.locals.mod) {
      return res.status(403).send('Forbidden');
    }

    let mapId = req.query.mapId || req.body.mapId;

    // Sanitize mapId
    mapId = validator.trim(mapId);
    mapId = validator.escape(mapId);

    // Delete the map
    await mapIdController.deleteMapById(mapId);

    res.redirect('/admin');
  } catch (error) {
    console.error('Error deleting mapId:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/uniqueUsernames', async (req, res) => {
  try {
    const uniqueUsernames = await mapIdController.getUniqueUsernames();
    res.json(uniqueUsernames);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/uniqueArtists', async (req, res) => {
  try {
    const uniqueArtists = await mapIdController.getUniqueArtists();
    res.json(uniqueArtists);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/uniqueServers', async (req, res) => {
  try {
    const uniqueServers = await mapIdController.getUniqueServers();
    res.json(uniqueServers);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;