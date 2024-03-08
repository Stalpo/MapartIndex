// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const moment = require('moment');

// Init express
const app = express();
const PORT = 3000;

// Controllers
const userController = require('./controllers/userController');

// View engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

// loggedIn variable middleware
app.use((req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    const verificationResult = userController.verifyToken(token);

    if (verificationResult.valid) {
      // Token is valid, you can use the verified data
      res.locals.username = verificationResult.username;
    } else {
      // Token is not valid, handle the error as needed
      console.error(verificationResult.error);
    }
  }

  next();
});

// Custom middleware for console logging
const logMiddleware = (req, res, next) => {
  const timestamp = moment().format('MM-DD HH:mm:ss');
  const method = req.method;
  const url = req.url;

  res.on('finish', () => {
    const statusCode = res.statusCode;
    const responseTime = new Date() - req.startTime;
    console.log(`[${timestamp}] ${method} ${url} ${statusCode} - ${responseTime}ms`);
  });

  req.startTime = new Date();
  next();
};

app.use(logMiddleware);

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
app.get('/profile', (req, res) => {
  // About ready to start building controller and model.
  res.render('profile');
});

app.post('/profile', async (req, res) => {
  // This does nothing until I make the profile model and controller.
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
