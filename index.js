// External dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const gitlog = require("gitlog").default;

// Internal dependencies
const {
  setFilePath,
  loggedInMiddleware,
  loggingMiddleware,
  checkAdminStatus,
  checkModStatus
} = require('./middleware');

// Init express
const app = express();
const PORT = 3000;

// Controllers
const userController = require('./controllers/userController');
const mapIdController = require('./controllers/mapIdController');
const mapArtController = require('./controllers/mapArtController');

// View engine
app.set('view engine', 'pug');
app.locals.pretty = true;
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Custom middleware
app.use(setFilePath);
app.use(loggedInMiddleware);
app.use(loggingMiddleware);
app.use(checkAdminStatus);
app.use(checkModStatus);

// Set up the storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/tmp'); // Upload files to a temporary directory
  },
  filename: function (req, file, cb) {
    // Generate a unique filename
    const filename = Date.now() + '-' + file.originalname;
    cb(null, filename);
  }
});

// File filter for multer
const fileFilter = (req, file, cb) => {
  // Check if the file is a PNG image
  if (file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Only PNG images are allowed!'), false);
  }
};

// Init multer storage, file filter, and limits
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 64, // 64 KB limit
  },
});

// File filter for multer (initial push exceptions)
const fileFilterExceptions = (req, file, cb) => {
  cb(null, true);
};

// Init multer storage, file filter, and limits (initial push exceptions)
const uploadExceptions = multer({
  storage,
  fileFilterExceptions,
  limits: {
    fileSize: 1024 * 64, // 64 KB limit
  },
});

// User Routes
const userRoutes = require('./routes/user');
app.use('/user', userRoutes);

// Profile Routes
const profileRoutes = require('./routes/profile');
app.use('/profile', profileRoutes);

// MapId Routes
const mapIdRoutes = require('./routes/mapid');
app.use('/mapid', mapIdRoutes);

// MapArt Routes
const mapArtRoutes = require('./routes/mapart');
app.use('/mapart', mapArtRoutes);

// Admin Routes
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

// Discord Routes
const discord = require('./routes/discord');
app.use('/discord', discord);

// API Routes
const api = require('./routes/api');
app.use('/api', api);

// Index route
app.get('/', async (req, res) => {
  try {
    const totalMaps = (await mapIdController.getMaps()).length;
    const totalMaparts = (await mapArtController.getAllMapArts()).length;
    const totalUsers = (await userController.getAllUsers()).length;
    const totalServers = (await mapIdController.getUniqueServers()).length;
    res.render('index', { totalMaps, totalUsers, totalMaparts, totalServers });
  } catch {
    console.error('Error fetching statistics:', error);
    res.render('index');
  }
});

// About route
app.get('/about', (req, res) => {
  res.render('page-about');
});

// Changelog route
app.get('/changelog', (req, res) => {
  const options = {
    repo: path.resolve(__dirname, '.git'),
    number: 25, // Number of commits to fetch
    fields: ['abbrevHash', 'subject', 'authorDateRel', 'authorName']
  };

  gitlog(options, (error, commits) => {
    if (error) {
      console.error(`Error fetching git log: ${error}`);
      res.status(500).send('Error fetching changelog');
      return;
    }
    res.render('page-changelog', { commits });
  });
});

// initialPush route
app.get('/initialPush', async (req, res) => {
  if (!res.locals.admin) {
    return res.status(403).send('Forbidden');
  }
  res.render('initialPush');
});

// POST endpoint for initial push
app.post('/initialPush', uploadExceptions.array('images', 4000), async (req, res) => {
  try {
    // Check if user is an admin
    if (!res.locals.admin) {
      return res.status(403).send('Forbidden');
    }

    const { files } = req;
    files.sort(compareForInitialPush);

    if (!files || files.length === 0) {
      // If no files are provided
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedFiles = [];
    const oldmaparts = [];

    // Process each file
    for (const file of files) {
      const { filename, path, originalname } = file;

      // if maplist file store mapart configs
      if(filename.includes('mapList.js')){
        const data = fs.readFileSync(path).toString();

        const almostFullMaps = data.split('new FullMap("",');

        const fullMaps = [];
        let skip = true;
        for(const almostFullMap of almostFullMaps){
          if(skip){
            skip = false;
            continue;
          }
          fullMaps.push(almostFullMap.split(')')[0]);
        }

        for(const fullMap of fullMaps){
          const fullMapInfo = fullMap.split(', ');
          const special = [];
          for(let i = 3; i < fullMapInfo.length; i+=2){
            special.push([parseInt(fullMapInfo[i].charAt(fullMapInfo[i].length - 1)), parseInt(fullMapInfo[i + 1].charAt(0))]);
          }
          const mapArt = {
            startIndex: parseInt(fullMapInfo[0]),
            width: parseInt(fullMapInfo[1]),
            height: parseInt(fullMapInfo[2]),
            special: special
          };

          oldmaparts.push(mapArt);
        }
        continue;
      }

      // Generate the desired filename based on server
      const server = req.body.server;
      const newFilename = await mapIdController.generateFilename(server);

      // Get current map count + 1
      const serverId = await mapIdController.getLatestServerIdByServer(server) + 1;

      // Construct the new filepath manually
      const newFilepath = __dirname + '/public/uploads/' + newFilename;

      let displayName;
      if (newFilename.endsWith(".png")) {
        displayName = newFilename.slice(0, -4);
      }

      // Rename the file
      fs.renameSync(path, newFilepath);

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

    // Send a response with the mapart stitching info
    res.status(200).json({ message: 'Upload successful', mapArtInfo: oldmaparts, files: uploadedFiles });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// sort function for initial push
function compareForInitialPush(a, b) {
  if(a.filename.includes('mapList.js')){
    return -1;
  }else if(b.filename.includes('mapList.js')){
    return 1;
  }
  return parseInt(a.filename.split('_')[1]) - parseInt(b.filename.split('_')[1]);
}

// Define route for handling 404 errors
app.use(function(req, res, next) {
  res.status(404);
  if (req.originalUrl.startsWith('/api')) {
    return res.json({ error: 'Not found' });
  }
  res.render('404');
});

// Define route for handling 500 errors
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  if (req.originalUrl.startsWith('/api')) {
    return res.json({ error: 'Internal server error' });
  }
  res.render('500');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;