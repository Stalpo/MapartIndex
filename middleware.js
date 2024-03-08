const moment = require('moment');
const userController = require('./controllers/userController');

// loggedIn variable middleware
const loggedInMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    const verificationResult = userController.verifyToken(token);

    if (verificationResult.valid) {
      // Token is valid, you can use the verified data
      res.locals.username = verificationResult.username;
      // res.locals.userId = userController.getIdFromUsername(verificationResult.username);
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
  loggedInMiddleware,
  loggingMiddleware,
};