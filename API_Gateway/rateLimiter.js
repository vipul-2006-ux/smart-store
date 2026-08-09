const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: {
    success: false,
    message: 'You can enter the password after 30 seconds'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = {
  loginLimiter
};
