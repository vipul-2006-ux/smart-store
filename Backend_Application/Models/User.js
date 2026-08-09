const { DataTypes } = require('sequelize');
const sequelize = require('../Configuration/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'USER'
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      // The original mock logic didn't re-hash passwords explicitly in models, 
      // but it's good practice. Alternatively, let the repository handle hashing.
      // We will hash it here if it's not already hashed (assuming bcrypt output length is ~60).
      if (user.password && user.password.length < 50) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

module.exports = User;