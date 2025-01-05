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
const mapArtController = require('../controllers/mapArtController');
const serverController = require('../controllers/serverController');

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

// get all image data for duplicate checking (super ram intensive so depricate as needed)
let checkImgDatas = [];

fs.readdir(`${__dirname.slice(0, -7)}/public/uploads`, async function (err, files) {
  //handling error
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  } 
  console.log("starting image loading");
  //listing all files using forEach
  const percentReport = .05;
  let reportNumber = 1;
  for(let i = 0; i < files.length; i++) {
    // log percent done
    if(i >= Math.floor(files.length * percentReport * reportNumber)){
      console.log(`${reportNumber * Math.floor(percentReport * 100)}% done loading images`);
      reportNumber++;
    }

    // Do whatever you want to do with the file
    if(files[i] === "mapart" || files[i] === "server" || files[i] === "tmp" || files[i] === ".placeholder"){
      
    }else{
      const data = new Uint8Array(await loadImg(`${__dirname.slice(0, -7)}/public/uploads/${files[i]}`));
      if(data != null){
        checkImgDatas.push({
          data: data,
          name: files[i],
          server: files[i].split("_")[0]
        });
      }
    }
  };
  console.log("finished image loading");
});

function loadServerImgDatas(server){
  fs.readdirSync(`${__dirname.slice(0, -7)}/public/uploads`, async function (err, files) {
    //handling error
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    } 
    console.log("starting image loading");
    //listing all files using forEach
    const percentReport = .05;
    let reportNumber = 1;
    for(let i = 0; i < files.length; i++) {
      // log percent done
      if(i >= Math.floor(files.length * percentReport * reportNumber)){
        console.log(`${reportNumber * Math.floor(percentReport * 100)}% done loading images`);
        reportNumber++;
      }
  
      // Do whatever you want to do with the file
      if(files[i] === "mapart" || files[i] === "server" || files[i] === "tmp" || files[i] === ".placeholder" || files[i].split("_")[0] !== server){
        
      }else{
        const data = new Uint8Array(await loadImg(`${__dirname.slice(0, -7)}/public/uploads/${files[i]}`));
        if(data != null){
          checkImgDatas.push({
            data: data,
            name: files[i],
            server: files[i].split("_")[0]
          });
          //console.log(`loaded img ${checkImgDatas.length}`);
        }
      }
    };
    console.log("finished image loading");
  });
}

const pixelDict = {};
let s = 0;

function loadImg(path) {
  return new Promise((resolve, reject) => {
    getPixels(path, function(err, data) {
      if(err) {
        reject(err)
      } else {
        if(data.shape[0] != 128 || data.shape[1] != 128){
          resolve([]);
        }
        const shortData = [];
        for(let x = 0; x < 128; x++){
          for(let y = 0; y < 128; y++){
            // compress pixel 2d array with 3rd array for RGBA to just array of what color id it is
            const short = data.get(x, y, 0) + (data.get(x, y, 1) << 8) + (data.get(x, y, 2) << 16) + (data.get(x, y, 3) << 24);
            if(pixelDict[short] == null){
              pixelDict[short] = s;
              s++;
            }
            shortData.push(pixelDict[short]);
          }
        }
        resolve(shortData);
      }
    })
  });
}

router.get('/gallery', async (req, res) => {
  let server = "";
  if(req.subdomains.length != 0){
    server = req.subdomains[0];
  }
  if(req.subdomains.length == 0 || server === "www"){
    res.render('mapid-gallery');
  }else{
    const serverObj = (await serverController.getServerByName(server));
    const { displayName } = serverObj;
    res.render('mapid-gallery', { server, displayName });
  }
});

router.get('/create', async (req, res) => {
  let server = "";
  if(req.subdomains.length != 0){
    server = req.subdomains[0];
  }
  if(req.subdomains.length == 0 || server === "www"){
    res.render('mapid-create');
  }else{
    res.render('mapid-create', { server });
  }
});

router.post('/create', mapIdUpload.array('images', 4000), async (req, res) => {
  try {
    // Check if user is an admin and a moderator
    if (!res.locals.admin && !res.locals.mod) {
      return res.status(403).send('Forbidden');
    }

    const { files } = req;

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

      // check if duplicate (if maxwrong neg skip) or if img size not right
      const imgData = new Uint8Array(await loadImg(newFilepath));
      if(imgData.length == 0){
        fs.unlinkSync(newFilepath);
        return res.status(500).json({ error: `${originalname} is not correct img dimensions (128x128)! all maps before ${originalname} have been uploaded` });
      }

      if(req.body.maxWrong >= 0){
        //loadServerImgDatas(server);

        const duplicateOf = isDuplicate(imgData, req.body.maxWrong, req.body.server);
        if(duplicateOf != null){
          fs.unlinkSync(newFilepath);
          return res.status(500).json({ error: `${originalname} is a duplicate of ${duplicateOf}! all maps before ${originalname} have been uploaded` });
        }

        //checkImgDatas = [];
      }

      // add to checkImgs
      checkImgDatas.push({
        data: imgData,
        name: newFilename,
        server: req.body.server
      });

      // Read the image file and convert it to base64
      const base64 = fs.readFileSync(newFilepath, { encoding: 'base64' });

      // Calculate a hash of the base64 data
      const hash = crypto.createHash('md5').update(base64).digest('hex');

      // Add metadata to the db
      let nsfw = false;
      if(req.body.nsfw === "on"){
        nsfw = true;
      }

      const mapid = await mapIdController.createMapId({
        userId: res.locals.userId,
        username: res.locals.username,
        imgUrl: newFilename,
        displayName: displayName,
        hash: hash,
        server: req.body.server,
        serverId: serverId,
        nsfw: nsfw,
      });

      // upload also as maparts if all 1x1s
      if(req.body.singles === "on"){
        const newFilename2 = await mapArtController.generateFilename(req.body.server);
        const serverId2 = await mapArtController.getLatestServerIdByServer(req.body.server) + 1;
        const newFilepath2 = `${res.locals.filepath}/public/uploads/mapart/${newFilename2}`;

        let displayName2 = newFilename2.endsWith(".png") ? newFilename2.slice(0, -4) : undefined;

        if (!path) {
          return res.status(400).json({ error: 'File path missing' });
        }
    
        fs.copyFileSync(newFilepath, newFilepath2);
    
        const base642 = fs.readFileSync(newFilepath2, { encoding: 'base64' });
        const hash2 = crypto.createHash('md5').update(base642).digest('hex');

        const result = await mapArtController.createMapId({
          userId: res.locals.userId,
          username: res.locals.username,
          imgUrl: newFilename2,
          description: "",
          mapIds: [mapid.id],
          width: 1,
          height: 1,
          displayName: displayName2,
          hash: hash2,
          server: req.body.server,
          serverId: serverId2,
          nsfw: nsfw,
        });
      }

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

function isDuplicate(imgData, maxWrong, server){
  let dupName = null;
  checkImgDatas.forEach(checkImgData => {
    if(dupName == null && checkImgData.server == server){
      let wrong = 0;
      let dup = true;

      for(let x = 0; x < 128 * 128; x++){
        if(checkImgData.data[x] != imgData[x]){
          wrong++;
          if(wrong > maxWrong){
            dup = false;
          }
        }
      }
      if(dup){
        dupName = checkImgData.name;
      }
    }
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