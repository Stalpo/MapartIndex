const express = require('express');
const router = express.Router();
const validator = require('validator');

// Required controllers
const profileController = require('../controllers/profileController');
const userController = require('../controllers/userController');

// Profile route
router.get('/', async (req, res) => {
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
router.get('/user/:username', async (req, res) => {
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
      res.locals.isAdmin = await userController.isAdmin(user.id);
      res.locals.isMod = await userController.isMod(user.id);
    } else {
      // Not loggedIn user requested
      res.locals.profile = await profileController.getProfileById(user.id);
      res.locals.userMaps = await profileController.getAllMapsForUserId(user.id);
      res.locals.isAdmin = await userController.isAdmin(user.id);
      res.locals.isMod = await userController.isMod(user.id);
    }
    
    profileController.incrementProfileViews(userId);

    res.render('profile');
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Profile editing route
router.get('/edit', async (req, res) => {
  const userId = res.locals.userId;
  if (userId) {
    res.locals.profile = await profileController.getProfileById(userId);
  }
  res.render('profile-edit');
});

router.post('/edit', async (req, res) => {
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

module.exports = router;