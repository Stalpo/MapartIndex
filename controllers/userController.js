const userModel = require('../models/userModel');
const profileController = require('../controllers/profileController');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const isAdmin = async (userId) => {
  try {
    const user = await userModel.isAdmin(userId);
    return user;
  } catch (error) {
    console.error('Error in isAdmin:', error);
    return false;
  }
};

const isMod = async (userId) => {
  try {
    const user = await userModel.isMod(userId);
    return user;
  } catch (error) {
    console.error('Error in isMod:', error);
    return false;
  }
};

const getApiKeyById = async (userId) => {
  try {
    const apiKey = await userModel.getApiKeyById(userId);
    return apiKey;
  } catch (error) {
    console.error('Error in getApiKeyById:', error);
    return null;
  }
};

const verifyApiKey = async (apiKey) => {
  try {
    const isValid = await userModel.verifyApiKey(apiKey);
    return isValid;
  } catch (error) {
    console.error('Error in verifyApiKey:', error);
    return false;
  }
};

const newApiKey = async (userId) => {
  try {
    const newApiKey = await userModel.renewApiKey(userId);
    return newApiKey;
  } catch (error) {
    console.error('Error in renewApiKey:', error);
    return null;
  }
};

const getUserById = async (userId) => {
  try {
    const user = await userModel.getUserById(userId);
    return user;
  } catch (error) {
    console.error('Error in getUserById:', error);
    return null;
  }
};

const getUsernameById = async (userId) => {
  try {
    const user = await userModel.getUsernameById(userId);
    return user;
  } catch (error) {
    console.error('Error in getUserById:', error);
    return null;
  }
};

const getUserByUsername = async (username) => {
  try {
    const user = await userModel.getUserByUsername(username);
    return user;
  } catch (error) {
    console.error('Error in getUserByUsername:', error);
    throw error;
  }
};

const getAllUsers = async () => {
  try {
    return await userModel.getAllUsers();
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    throw error;
  }
};

const registerUser = async (username, password) => {
  // Validate username
  if (username.length < 5 || !isAlphanumeric(username)) {
    return { error: 'Invalid username. It must be at least 5 characters and only alphanumeric.' };
  }

  // Validate password
  if (password.length < 8) {
    return { error: 'Invalid password. It must be at least 8 characters.' };
  }

  const existingUser = await userModel.getUserByUsername(username);

  if (existingUser) {
    return { error: 'Username already exists' };
  }

  try {
    const hashedPw = await bcrypt.hash(password, 10);
    // Create the user
    const user = await userModel.createUser({ username, hashedPw });
    
    // Create the profile for the user
    await profileController.createProfile({
      userId: user.id,
      username: username,
      location: "Unknown",
      email: "Unknown",
      mcUid: "Unknown",
      joinDate: new Date(),
      lastSeenDate: new Date(),
    });

    return { message: 'User registered successfully' };
  } catch (error) {
    console.error('Error in registerUser:', error);
    return { error: 'Error registering user' };
  }
};

const loginUser = async (username, password) => {
  // Sanitize inputs
  username = sanitizeInput(username);
  password = sanitizeInput(password);

  try {
    const user = await userModel.getUserByUsername(username);

    if (!user) {
      return { error: 'Invalid username or password' };
    }

    const passwordMatch = await bcrypt.compare(password, user.hashedPw);
    if (!passwordMatch) {
      return { error: 'Invalid username or password' };
    }

    const token = jwt.sign({ username }, process.env.SECRET_KEY, { expiresIn: '24h' });
    return { token };
  } catch (error) {
    console.error('Error in loginUser:', error);
    throw error;
  }
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return { valid: true, username: decoded.username, token: token };
  } catch (error) {
    console.error('Error verifying token:', error.message);
    return { valid: false, error: error.message };
  }
};

const loginDiscordUser = async (userId, discordId, username, avatar, email) => {
  try {
    // Get the user by ID
    let user = await userModel.getUserById(userId);

    // If the user doesn't exist, create a new user with Discord data
    if (!user) {
      user = await userModel.createUserDiscord({ userId, discordId, username, avatar, email });
    } else {
      // If the user exists, check if it's already linked to a Discord account
      let discordUser = await userModel.getUserByDiscordId(discordId);
      if (discordUser) {
        return { error: 'User has already linked a discord account!' };
      }
      await userModel.updateUserDiscordInfo(userId, { discordId, username, avatar, email });
    }

    // Generate JWT token for the user
    const token = jwt.sign({ username }, process.env.SECRET_KEY, { expiresIn: '24h' });
    
    return { token };
  } catch (error) {
    console.error('Error in loginDiscordUser:', error);
    throw error;
  }
};

const updateUserPassword = async (userId, password) => {
  try {
    const newHashedPw = await bcrypt.hash(password, 10);

    const user = await getUserById(userId);
    if (user.discordId !== null) {
      return { error: 'Skipping password update for Discord user!' };
    } else {
      return await userModel.updateUserPassword(userId, newHashedPw);
    }
  } catch (error) {
    console.error('Error in updateUserPassword:', error);
    throw error;
  }
};

const getUserByApiKey = async (apiKey) => {
  try {
    return await userModel.getUserByApiKey(apiKey);
  } catch (error) {
    console.error('Error in getUserByApiKey:', error);
    throw error;
  }
};

const deleteUserById = async (userId) => {
  try {
    const result = await userModel.deleteUserById(userId);
    return result;
  } catch (error) {
    console.error('Error in deleteUserById:', error);
    return { error: 'Error deleting user' };
  }
};

// Function to check if a string is alphanumeric
const isAlphanumeric = (str) => /^[a-zA-Z0-9]+$/.test(str);

// Sanitize input
const sanitizeInput = (input) => validator.escape(input);

// Get userId from username
const getIdFromUsername = async (username) => {
  try {
    const user = await userModel.getUserByUsername(username);
    return user ? user.id : null;
  } catch (error) {
    console.error('Error in getIdFromUsername:', error);
    throw error;
  }
};

module.exports = {
  isAdmin,
  isMod,
  getApiKeyById,
  verifyApiKey,
  newApiKey,
  getUserById,
  getUsernameById,
  getUserByUsername,
  getAllUsers,
  registerUser,
  loginUser,
  updateUserPassword,
  verifyToken,
  loginDiscordUser,
  getUserByApiKey,
  deleteUserById,
  getIdFromUsername,
};
