const cors = require('cors');

module.exports = cors({
  origin: 'https://smartstore.com',
  optionsSuccessStatus: 200
});