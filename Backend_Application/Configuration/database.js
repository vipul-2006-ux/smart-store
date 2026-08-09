const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize('smart store', 'postgres', 'vipul2006', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;
