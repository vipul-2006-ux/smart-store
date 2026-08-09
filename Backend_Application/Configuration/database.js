const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
      logging: false
    })
  : new Sequelize('smart store', 'postgres', 'vipul2006', {
      host: 'localhost',
      port: 5432,
      dialect: 'postgres',
      logging: false,
    });

module.exports = sequelize;
