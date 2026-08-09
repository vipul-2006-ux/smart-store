const { DataTypes } = require('sequelize');
const sequelize = require('../Configuration/database');

const Order = sequelize.define('Order', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true // Guest checkout allows null
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
});

module.exports = Order;
