// External dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const gitlog = require("gitlog").default;

// Internal dependencies
const {
  setFilePath,
  checkUserStatus,
  checkAdminStatus,
  checkModStatus,
  requestLogger,
} = require('./middleware');

// Init express
const app = express();
const PORT = 3000;

// Controllers
const userController = require('./controllers/userController');
const serverController = require('./controllers/serverController');
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
app.use(checkUserStatus);
app.use(checkAdminStatus);
app.use(checkModStatus);
app.use(requestLogger);

// User Routes
const userRoutes = require('./routes/user');
app.use('/user', userRoutes);

// Profile Routes
const profileRoutes = require('./routes/profile');
app.use('/profile', profileRoutes);

// Server Routes
const serverRoutes = require('./routes/server');
app.use('/server', serverRoutes);

// MapId Routes
const mapIdRoutes = require('./routes/mapid');
app.use('/mapid', mapIdRoutes);

// MapArt Routes
const mapArtRoutes = require('./routes/mapart');
app.use('/mapart', mapArtRoutes);

// MapSearch Routes
const mapSearchRoutes = require('./routes/search');
app.use('/search', mapSearchRoutes);

// Admin Routes
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

// Discord Routes
const discord = require('./routes/discord');
app.use('/discord', discord);

// API Routes
const api = require('./routes/api');
app.use('/api', api);

// System Routes
const system = require('./routes/system');
app.use('/system', system);

// Index route
app.get('/', async (req, res) => {
  try {
    let server = "";
    if(req.subdomains.length != 0){
      server = req.subdomains[0];
    }
    if(req.subdomains.length == 0 || server === "www"){
      const totalMaps = (await mapIdController.countMapIds());
      const totalMaparts = (await mapArtController.countAllMapArts());
      const totalUsers = (await userController.getAllUsers()).length;
      const totalServers = (await mapIdController.getUniqueServers()).length;
      res.render('index', { totalMaps, totalUsers, totalMaparts, totalServers });
    }else{
      const totalMaps = (await mapIdController.countMapIdsByServer(server));
      const totalMaparts = (await mapArtController.countMapIdsByServer(server));
      const { displayName, discord } = (await serverController.getServerByName(server));
      console.log(displayName);
      res.render('index', { server, displayName, discord, totalMaps, totalMaparts });
    }
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