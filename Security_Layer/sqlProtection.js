// Middleware to prevent SQL injection (conceptual for demo)
module.exports = (req, res, next) => {
  console.log('Scanning for SQLi...');
  next();
};