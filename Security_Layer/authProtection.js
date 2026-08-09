const { verifyToken } = require('../Utilities/jwt');
const { sendError } = require('../Utilities/response');

module.exports = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return sendError(res, 401, 'No token provided');
  
  try {
    req.user = verifyToken(token.split(' ')[1]);
    next();
  } catch (err) {
    sendError(res, 401, 'Invalid token');
  }
};