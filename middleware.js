const moment = require('moment');
const userController = require('./controllers/userController');
const profileController = require('./controllers/profileController');

// Check admin status middleware
const checkAdminStatus = async (req, res, next) => {
  try {
    const userId = res.locals.userId;
    if (userId) {
      const isAdminUser = await userController.isAdmin(userId);
  
      if (isAdminUser) {
        res.locals.admin = true;
      } else {
        res.locals.admin = false;
      }
    }
    next();
  } catch (error) {
    console.error('Error checking admin status:', error);
    res.locals.admin = false;
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
    }
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
  checkAdminStatus,
  loggedInMiddleware,
  loggingMiddleware,
};