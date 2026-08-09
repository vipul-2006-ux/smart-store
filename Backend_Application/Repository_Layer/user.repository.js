const User = require('../Models/User');

exports.findByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

exports.findByUsername = async (username) => {
  return await User.findOne({ where: { username } });
};

exports.findById = async (id) => {
  return await User.findByPk(id);
};

exports.create = async (data) => {
  return await User.create(data);
};