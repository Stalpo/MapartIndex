// External dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const sanitize = require('sanitize-filename');
const validator = require('validator');
const archiver = require('archiver');

// Internal dependencies
const { loggedInMiddleware, loggingMiddleware, checkAdminStatus, checkModStatus } = require('./middleware');

// Init express
const app = express();
const PORT = 3000;

// Controllers
const userController = require('./controllers/userController');
const profileController = require('./controllers/profileController');
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

// Multer setup for handling file uploads in /mapArt-create
const mapArtStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/mapArt/tmp'); // Upload files to a directory specific to mapArt
  },
  filename: function (req, file, cb) {
    // Generate a unique filename based on timestamp and random string
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + '.png'; // Ensure the file ends with .png
    cb(null, filename);
  }
});

// Init multer storage, file filter, and limits for /mapArt-create
const mapArtUpload = multer({
  storage: mapArtStorage,
  fileFilter: fileFilter, // Assuming fileFilter is defined elsewhere
  limits: {
    fileSize: 1024 * 1024 * 2, // 10 MB limit for mapArt images
  },
});

// Custom routes
const discord = require('./routes/discord');
app.use('/discord', discord);
const api = require('./routes/api');
app.use('/api', api);

// Index route
app.get('/', async (req, res) => {
  try {
    const totalMaps = (await mapIdController.getMaps()).length;
    const totalUsers = (await userController.getAllUsers()).length;
    res.render('index', { totalMaps, totalUsers });
  } catch {
    console.error('Error fetching statistics:', error);
    res.render('index');
  }
});

// Register route
app.get('/register', (req, res) => {
  if (res.locals.username) {
    res.redirect('/');
  } else {
    res.render('register');
  }
});

app.post('/register', async (req, res) => {
  let { username, password } = req.body;

  // Sanitize and validate username
  username = validator.trim(username);
  username = typeof username === 'string' ? username.toLowerCase() : '';

  // Sanitize password
  password = validator.trim(password);

  // Check if username or password are empty after trimming
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  // Proceed with registration
  const result = await userController.registerUser(username, password);
  return res.status(result.error ? 400 : 201).json(result);
});

// Login route
app.get('/login', (req, res) => {
  if (res.locals.username) {
    res.redirect('/');
  } else {
    res.render('login');
  }
});

app.post('/login', async (req, res) => {
  let { username, password } = req.body;

  // Sanitize username
  username = validator.trim(username);
  username = validator.escape(username);

  // Sanitize password
  password = validator.trim(password);
  password = validator.escape(password);

  const lowercaseUsername = username.toLowerCase();
  const result = await userController.loginUser(lowercaseUsername, password);
  
  // Set cookie
  if (result.token) {
    res.cookie("token", result.token);
  }

  return res.status(result.error ? 401 : 200).json(result);
});

// Logout route
app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

// Profile route
app.get('/profile', async (req, res) => {
  const userId = res.locals.userId;
  if (userId) {
    res.locals.profile = await profileController.getProfileById(userId);
    res.locals.userMaps = await profileController.getAllMapsForUserId(userId);
    res.locals.apiKey = await userController.getApiKeyById(userId);
    res.locals.isAdmin = await userController.isAdmin(userId);
    res.locals.isMod = await userController.isMod(userId);
  }
  res.render('profile');
});

// Profile route, request other user profile
app.get('/profile/:username', async (req, res) => {
  try {
    let requestedUsername = req.params.username;

    // Sanitize username
    requestedUsername = validator.trim(requestedUsername);
    requestedUsername = validator.escape(requestedUsername);

    requestedUsername = requestedUsername.toLowerCase();

    const user = await userController.getUserByUsername(requestedUsername);

    if (!user) {
      // User not found
      return res.status(404).send('User not found');
    }

    const userId = res.locals.userId;
    const reqUserId = user.id;

    if (userId === reqUserId) {
      // Logged in user requested
      res.locals.profile = await profileController.getProfileById(userId);
      res.locals.userMaps = await profileController.getAllMapsForUserId(userId);
      res.locals.apiKey = await userController.getApiKeyById(userId);
      res.locals.isAdmin = await userController.isAdmin(userId);
      res.locals.isMod = await userController.isMod(userId);
    } else {
      // Not loggedIn user requested
      res.locals.profile = await profileController.getProfileById(user.id);
      res.locals.userMaps = await profileController.getAllMapsForUserId(user.id);
      res.locals.isAdmin = await userController.isAdmin(user.id);
      res.locals.isMod = await userController.isMod(user.id);
    }

    res.render('profile');
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Profile editing route
app.get('/profile-edit', async (req, res) => {
  const userId = res.locals.userId;
  if (userId) {
    res.locals.profile = await profileController.getProfileById(userId);
  }
  res.render('profile-edit');
});

app.post('/profile-edit', async (req, res) => {
  try {
    const userId = res.locals.userId;

    // Collect the updated profile data from the form and sanitize
    const { bio, email, location, avatar, mcUuid } = req.body;

    const sanitizedBio = validator.trim(bio);
    const sanitizedEmail = validator.trim(email);
    const sanitizedLocation = validator.trim(location);

    // Check if the avatar is a valid URL
    const isAvatarURLValid = validator.isURL(avatar);
    const sanitizedAvatar = isAvatarURLValid ? avatar : '';

    const isValidUuid = validator.isUUID(mcUuid);
    const sanitizedUuid = isValidUuid ? mcUuid : '';


    // Update the user's profile
    await profileController.updateProfile(userId, {
      bio: sanitizedBio,
      email: sanitizedEmail,
      location: sanitizedLocation,
      avatar: sanitizedAvatar,
      mcUuid: sanitizedUuid
    });

    // Redirect to the profile page after editing
    res.redirect('/profile');
  } catch (error) {
    console.error('Error editing profile:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Upload route
app.get('/upload', async (req, res) => {
  res.render('upload');
});

// POST endpoint for uploading files
app.post('/upload', upload.array('images', 4000), async (req, res) => {
  try {
    // Check if user is an admin
    if (!res.locals.admin) {
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

      // Construct the new filepath manually
      const newFilepath = __dirname + '/public/uploads/' + newFilename;

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
        hash: hash,
        server: req.body.server
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

app.get('/gallery', async (req, res) => {
  res.render('gallery');
});

app.get('/admin', async (req, res) => {
  try {
    const allUsers = await userController.getAllUsers();
    res.render('admin', { allUsers });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to download the zip file
app.get('/admin/download', (req, res) => {
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


app.get('/mapId/:id', async (req, res) => {
  try {
    let mapId = req.params.id;

    // Sanitize mapId
    mapId = validator.trim(mapId);
    mapId = validator.escape(mapId);

    res.render('mapid', { pageTitle: 'MapId', mapId });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/mapId-edit/:id', async (req, res) => {
  try {
    let mapId = req.params.id;

    // Sanitize mapId
    mapId = validator.trim(mapId);
    mapId = validator.escape(mapId);

    const map = await mapIdController.getMapById(mapId);

    const user = await userController.getUserById(map.userId);

    res.render('mapid-edit', { pageTitle: 'Edit MapId', map, user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/mapId-edit/:id', upload.none(), async (req, res) => {
  try {
    // Check if user is an admin
    if (!res.locals.admin) {
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
      mapArtData: {
        // Add other MapArt data fields here
      },
    });
    
    res.redirect(`/admin`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/mapId-info/uniqueUsernames', async (req, res) => {
  try {
    const uniqueUsernames = await mapIdController.getUniqueUsernames();
    res.json(uniqueUsernames);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/mapId-info/uniqueArtists', async (req, res) => {
  try {
    const uniqueArtists = await mapIdController.getUniqueArtists();
    res.json(uniqueArtists);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/mapId-info/uniqueServers', async (req, res) => {
  try {
    const uniqueServers = await mapIdController.getUniqueServers();
    res.json(uniqueServers);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// MapArt route
app.get('/mapArt-create', (req, res) => {
  res.render('mapart-create');
});

app.post('/mapArt-create', mapArtUpload.single('file'), async (req, res) => {
  try {
    const { name, description, artist, server } = req.body;
    const { filename, path, originalname } = req.file;

    if (!req.file) {
      // If no files are provided
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Generate the desired filename based on server
    const newFilename = await mapArtController.generateFilename(server);

    // Construct the new filepath manually
    const newFilepath = __dirname + '/public/uploads/mapart/' + newFilename;

    // Rename the file
    fs.renameSync(path, newFilepath);

    // Read the image file and convert it to base64
    const base64 = fs.readFileSync(newFilepath, { encoding: 'base64' });

    // Calculate a hash of the base64 data
    const hash = crypto.createHash('md5').update(base64).digest('hex');

    const result = await mapArtController.createMapId({
      userId: res.locals.userId,
      username: res.locals.username,
      imgUrl: newFilename,
      name: name,
      description: description,
      artist: artist,
      hash: hash,
      server: server,
    });

    res.send(result);
  } catch (error) {
    console.error('Error creating map art:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete user route
app.get('/deleteUser', (req, res) => {
  res.render('deleteUser');
});

app.post('/deleteUser', async (req, res) => {
  try {
    const userId = res.locals.userId;

    // Delete the user
    await userController.deleteUserById(userId);
    res.clearCookie('token');
    res.redirect('/');

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete user route
app.get('/deleteMapId', (req, res) => {
  try {
    let mapId = req.query.mapId;

    // Sanitize mapId
    mapId = validator.trim(mapId);
    mapId = validator.escape(mapId);

    res.render('deleteMapId', { mapId: mapId });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/deleteMapId', async (req, res) => {
  try {
    // Check if user is an admin
    if (!res.locals.admin) {
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
