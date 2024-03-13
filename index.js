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

// Internal dependencies
const { loggedInMiddleware, loggingMiddleware, checkAdminStatus } = require('./middleware');

// Init express
const app = express();
const PORT = 3000;

// Controllers
const userController = require('./controllers/userController');
const profileController = require('./controllers/profileController');
const mapIdController = require('./controllers/mapIdController');

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

// Set up the storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(16, (err, buffer) => {
      if (err) return cb(err);

      const hash = buffer.toString('hex');
      const sanitizedFilename = sanitize(file.originalname);
      const filename = `${hash}${path.extname(sanitizedFilename)}`;
      
      cb(null, filename);
    });
  },
});

// File filter for multer
const fileFilter = (req, file, cb) => {
  // Check if the file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'), false);
  }
};

// Init multer storage, file filter, and limits
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 2, // 2 MB limit
  },
});

// Custom routes
const discord = require('./routes/discord');
app.use('/discord', discord);
const api = require('./routes/api');
app.use('/api', api);

// Index route
app.get('/', (req, res) => {
  res.render('index');
});

// Register route
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const lowercaseUsername = username.toLowerCase();
  const result = await userController.registerUser(lowercaseUsername, password);
  return res.status(result.error ? 400 : 201).json(result);
});

// Login route
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const lowercaseUsername = username.toLowerCase();
  const result = await userController.loginUser(lowercaseUsername, password);
  return res.status(result.error ? 401 : 200).json(result);
});

// Logout route
app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.render('logout');
});

// Profile route
app.get('/profile', async (req, res) => {
  const userId = res.locals.userId;
  if (userId) {
    res.locals.profile = await profileController.getProfileById(userId);
    res.locals.userMaps = await profileController.getAllMapsForUserId(userId);
    res.locals.apiKey = await userController.getApiKeyById(userId);
  }
  res.render('profile');
});

// Profile by username route
app.get('/profile/:username', async (req, res) => {
  try {
    const requestedUsername = req.params.username.toLowerCase();
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
    } else {
      // Not loggedIn user requested
      res.locals.profile = await profileController.getProfileById(user.id);
      res.locals.userMaps = await profileController.getAllMapsForUserId(user.id);
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

app.post('/upload', upload.array('images', 25), async (req, res) => {
  try {
    const { files } = req;

    if (!files || files.length === 0) {
      // If no files are provided
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Process each file
    const filenames = [];
    for (const file of files) {
      const { filename, path, size, mimetype } = file;

      // Read the image file and convert it to base64
      const base64 = fs.readFileSync(path, { encoding: 'base64' });

      // Calculate a hash of the base64 data
      const hash = crypto.createHash('md5').update(base64).digest('hex');

      // Add metadata to the db
      await mapIdController.createMapId({
        userId: res.locals.userId,
        username: res.locals.username,
        imgUrl: filename,
        hash: hash,
      });

      filenames.push(filename);
    }

    // Send a response with information about the uploaded files
    res.status(200).json({ message: 'Upload successful', files: filenames });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/gallery', async (req, res) => {
  res.render('gallery');
});

app.get('/mapId/:id', async (req, res) => {
  try {
    const mapId = req.params.id;

    res.render('mapid', { pageTitle: 'MapId', mapId });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
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

app.get('/mapId-edit/:id', async (req, res) => {
  try {
    const mapId = req.params.id;
    const map = await mapIdController.getMapById(mapId);

    const user = await userController.getUserById(map.userId);

    res.render('mapid-edit', { pageTitle: 'Edit MapId', map, user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/mapId-edit/:id', async (req, res) => {
  try {
    const mapId = req.params.id;
    const { artist, nsfw, /* Add other fields as needed */ } = req.body;

    // Update map details, including MapArt data
    await mapIdController.updateMapById(mapId, {
      artist,
      nsfw: nsfw === 'on',
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

// Delete user route
app.get('/deleteUser', (req, res) => {
  res.render('deleteUser');
});

app.post('/deleteUser', async (req, res) => {
  try {
    const userId = res.locals.userId;

    // Delete the user
    const result = await userController.deleteUserById(userId);
    res.clearCookie('token');
    res.redirect('/');

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete user route
app.get('/deleteMapId', (req, res) => {
  const mapId = req.query.mapId;
  res.render('deleteMapId', { mapId: mapId });
});

// Delete map by id ?mapId=
app.post('/deleteMapId', async (req, res) => {
  try {
    const mapId = req.query.mapId || req.body.mapId;
    console.log(mapId);
    if (res.locals.admin) {
      // Delete the map
      const result = await mapIdController.deleteMapById(mapId);
    }
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
