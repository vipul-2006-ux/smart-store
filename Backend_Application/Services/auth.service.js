const userRepository = require('../Repository_Layer/user.repository');
const { generateToken } = require('../Utilities/jwt');
const { comparePassword } = require('../Utilities/hash');

exports.login = async (username, password) => {
  const user = await userRepository.findByUsername(username);
  if (!user || !(await comparePassword(password, user.password))) {
    throw new Error('Invalid credentials');
  }
  return generateToken({ id: user.id, role: user.role, username: user.username });
};

exports.register = async (userData) => {
  return await userRepository.create(userData);
};