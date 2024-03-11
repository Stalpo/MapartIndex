const userModel = require('../models/userModel');
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

// Function to check if a string is alphanumeric
const isAlphanumeric = (str) => /^[a-zA-Z0-9]+$/.test(str);

// Sanitize input
const sanitizeInput = (input) => validator.escape(input);

// Get userId from username
const getIdFromUsername = async (username) => {
  const user = await userModel.getUserByUsername(username);
  return user ? user.id : null;
};

const getUserById = async (userId) => {
  const user = await userModel.getUserById(userId);
  return user;
};

// Register user
const registerUser = async (username, password) => {
  // Sanitize inputs
  username = sanitizeInput(username);
  password = sanitizeInput(password);

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
    await userModel.createUser({ username, hashedPw });

    return { message: 'User registered successfully' };
  } catch (error) {
    console.error('Error in registerUser:', error);
    return { error: 'Error registering user' };
  }
};

// Login user
const loginUser = async (username, password) => {
  // Sanitize inputs
  username = sanitizeInput(username);
  password = sanitizeInput(password);

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
};

// Function to verify a JWT token
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // Success
    return { username: decoded.username, token: token, valid: true };
  } catch (error) {
    console.error('Error verifying token:', error);
    return { error: 'Invalid token' };
  }
};

const loginDiscordUser = async (discordId, username, avatar, email) => {
  const user = await userModel.getUserByDiscordId(discordId);
  if(!user) {
    await userModel.createUserDiscord({ discordId, username, avatar, email })
  }
  const token = jwt.sign({ username }, process.env.SECRET_KEY, { expiresIn: '24h' });
  return { token };
}

const getUserByApiKey = async (apiKey) => {
  return await userModel.getUserByApiKey(apiKey);
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

module.exports = {
  isAdmin,
  getApiKeyById,
  verifyApiKey,
  newApiKey,
  registerUser,
  loginUser,
  getUserById,
  verifyToken,
  getIdFromUsername,
  loginDiscordUser,
  getUserByApiKey,
  deleteUserById,
};
