const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Function to check if a string is alphanumeric
const isAlphanumeric = (str) => /^[a-zA-Z0-9]+$/.test(str);

// Register user
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
    await userModel.createUser({ username, hashedPw });

    return { message: 'User registered successfully' };
  } catch (error) {
    console.error('Error in registerUser:', error);
    return { error: 'Error registering user' };
  }
};

// Login user
const loginUser = async (username, password) => {
  const user = await userModel.getUserByUsername(username);

  if (!user) {
    return { error: 'Invalid username or password' };
  }

  const passwordMatch = await bcrypt.compare(password, user.hashedPw);
  if (!passwordMatch) {
    return { error: 'Invalid username or password' };
  }

  const token = jwt.sign({ username }, 'secretkey', { expiresIn: '1h' });
  return { token };
};

module.exports = {
  registerUser,
  loginUser,
};