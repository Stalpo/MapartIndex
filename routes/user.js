const express = require('express');
const router = express.Router();
const validator = require('validator');

// Required controllers
const userController = require('../controllers/userController');

// Register route
router.get('/register', (req, res) => {
  if (res.locals.username) {
    res.redirect('/');
  } else {
    res.render('user-register');
  }
});

router.post('/register', async (req, res) => {
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
router.get('/login', (req, res) => {
  if (res.locals.username) {
    res.redirect('/');
  } else {
    res.render('user-login');
  }
});

router.post('/login', async (req, res) => {
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
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

router.get('/update-password', async (req, res) => {
  if (!res.locals.username) {
    res.redirect('/');
  } else {
    res.render('user-update-password');
  }
});

router.post('/update-password', async (req, res) => {
  let { password } = req.body;
  let userId = res.locals.userId;

  // Sanitize password
  password = validator.trim(password);
  password = validator.escape(password);

  const result = await userController.updateUserPassword(userId, password);

  return res.status(result.error ? 401 : 201).json(result);
});

// Delete user route
router.get('/deleteUser', (req, res) => {
  res.render('user-delete');
});

router.post('/deleteUser', async (req, res) => {
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

module.exports = router;