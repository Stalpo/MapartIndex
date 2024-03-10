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
const { loggedInMiddleware, loggingMiddleware } = require('./middleware');

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
app.use('/api/discord', discord);

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
  const result = await userController.registerUser(username, password);
  return res.status(result.error ? 400 : 201).json(result);
});

// Login route
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const result = await userController.loginUser(username, password);
  return res.status(result.error ? 401 : 200).json(result);
});

// Logout route
app.get('/logout', (req, res) => {
  res.render('logout');
});

// Profile route
app.get('/profile', async (req, res) => {
  const userId = res.locals.userId;
  if (userId) {
    res.locals.profile = await profileController.getProfileById(userId);
    res.locals.userMaps = await profileController.getAllMapsForUserId(userId);
  }
  res.render('profile');
});

// Profile editing route
app.get('/edit-profile', async (req, res) => {
  const userId = res.locals.userId;
  if (userId) {
    res.locals.profile = await profileController.getProfileById(userId);
  }
  res.render('edit-profile');
});

app.post('/edit-profile', async (req, res) => {
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

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      // If no file is provided
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Metadata from req.file
    const { filename, path, size, mimetype } = req.file;

    // Read the image file and convert it to base64
    const base64 = fs.readFileSync(path, { encoding: 'base64' });

    // Calculate a hash of the base64 data
    const hash = crypto.createHash('md5').update(base64).digest('hex');

    // Add metadata to the db
    await mapIdController.createMapId({
      userId: res.locals.userId,
      imgUrl: filename,
      hash: hash
    });
    // Send a response with information about the uploaded file
    res.status(200).json({ message: 'Upload successful', filename: filename });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Latest uploads route
app.get('/latest', async (req, res) => {
  try {
    const allMaps = await mapIdController.getAllMaps();
    res.render('latest', { allMaps });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
