const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../Security_Layer/.env') });

module.exports = {
  port: process.env.PORT || 8080,
  db: { url: process.env.DATABASE_URL },
  redis: { url: process.env.REDIS_URL },
  jwtSecret: process.env.JWT_SECRET || 'secret',
  mail: { host: process.env.SMTP_HOST, port: 587, user: 'user', pass: 'pass' }
};