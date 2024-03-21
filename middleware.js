const moment = require('moment');
const userController = require('./controllers/userController');
const profileController = require('./controllers/profileController');

// File path middleware
const setFilePath = () => {
  return (req, res, next) => {
    const currentPath = path.resolve(__dirname);
    res.locals.filepath = currentPath;
    next();
  };
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

// loggedIn variable middleware
const loggedInMiddleware = async (req, res, next) => {
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
      }

    } else {
      // Token is not valid, handle the error as needed
      console.error(verificationResult.error);
      res.locals.userId = null;
    }
  } else {
    // No token present, set userId to null
    res.locals.userId = null;
  }

  next();
};

// Custom middleware for console logging
const loggingMiddleware = (req, res, next) => {
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

module.exports = {
  setFilePath,
  checkAdminStatus,
  checkModStatus,
  loggedInMiddleware,
  loggingMiddleware,
};
