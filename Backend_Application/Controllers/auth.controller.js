const authService = require('../Services/auth.service');
const { sendSuccess, sendError } = require('../Utilities/response');

exports.login = async (req, res) => {
  try {
    const identifier = req.body.username || req.body.email;
    const token = await authService.login(identifier, req.body.password);
    sendSuccess(res, 200, 'Login successful', { token });
  } catch (err) {
    sendError(res, 401, err.message);
  }
};

exports.register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    sendSuccess(res, 201, 'User created', user);
  } catch (err) {
    sendError(res, 400, err.message);
  }
};