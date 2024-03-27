// Dependencies
const moment = require('moment');
const path = require('path');

// Required controllers
const userController = require('./controllers/userController');
const profileController = require('./controllers/profileController');

// File path middleware
const setFilePath = async (req, res, next) => {
  const currentPath = path.resolve(__dirname);
  res.locals.filepath = currentPath;
  next();
};

// Check admin status middleware
const checkAdminStatus = async (req, res, next) => {
  try {
    const userId = res.locals.userId;
    if(!userId) return next();
    const isAdminUser = await userController.isAdmin(userId);
    
    res.locals.admin = !!isAdminUser;

    next();
  } catch (error) {
    console.error('Error checking admin status:', error);
    res.locals.admin = false;
    next(error);
  }
};

// Check mod status middleware
const checkModStatus = async (req, res, next) => {
  try {
    const userId = res.locals.userId;
    if(!userId) return next();
    const isModUser = await userController.isMod(userId);
    
    res.locals.mod = !!isModUser;

    next();
  } catch (error) {
    console.error('Error checking mod status:', error);
    res.locals.mod = false;
    next(error);
  }
};

// Check user status middleware
const checkUserStatus = async (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    const verificationResult = userController.verifyToken(token);

    if (verificationResult.valid) {
      // Token is valid, you can use the verified data
      res.locals.username = verificationResult.username;

      // Set userId in the locals for future use
      const userId = await userController.getIdFromUsername(verificationResult.username);

      if (userId) {
        res.locals.userId = userId;
        // Update lastSeen
        await profileController.updateLastSeen(userId, new Date());
      } else {
        // User is not valid
        res.locals.userId = null;
        res.locals.username = null;
        res.clearCookie('token');
      }

    } else {
      // Token is not valid,
      res.locals.userId = null;
      res.locals.username = null;
      res.clearCookie('token');
    }
  } else {
    // No token present
    res.locals.userId = null;
    res.locals.username = null;
    res.clearCookie('token');
  }

  next();
};

// Console.log requests into the terminal
const requestLogger = (req, res, next) => {
  const timestamp = moment().format('MM-DD HH:mm:ss');
  const method = req.method;
  const url = req.url;
  const ip = req.ip;

  res.on('finish', () => {
    const statusCode = res.statusCode;
    const responseTime = new Date() - req.startTime;
    let statusColor = statusCode >= 500 ? '\x1b[31m' : statusCode >= 400 ? '\x1b[33m' : '\x1b[32m';
    console.log(`\x1b[36m[${timestamp}] \x1b[32m${method} \x1b[36m${url} from \x1b[33m${ip} ${statusColor}${statusCode}\x1b[0m - ${responseTime}ms`);
  });

  req.startTime = new Date();
  next();
};

module.exports = {
  setFilePath,
  checkAdminStatus,
  checkModStatus,
  checkUserStatus,
  requestLogger,
};
