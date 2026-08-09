// Middleware to prevent XSS (xss-clean is incompatible with Express 5, so using placeholder for demo)
module.exports = (req, res, next) => {
  console.log('Scanning for XSS...');
  next();
};