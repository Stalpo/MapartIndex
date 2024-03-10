// External dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

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
      const filename = `${hash}${path.extname(file.originalname)}`;
      
      cb(null, filename);
    });
  },
});

const upload = multer({ storage: storage });

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

app.post('/profile', async (req, res) => {
  // At the moment there is no editing profiles.
  // The controller has the functionality to but I need to make an edit profile view.
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
    res.status(200).json({
      filename,
      path,
      size,
      mimetype,
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
