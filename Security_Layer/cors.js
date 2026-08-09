const cors = require('cors');

module.exports = cors({
  origin: '*', // Allow all origins for now (can be restricted to specific URLs later)
  optionsSuccessStatus: 200
});