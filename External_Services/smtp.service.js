const mailConfig = require('../Backend_Application/Configuration/mail');

exports.sendMail = async (to, subject, text) => {
  await mailConfig.sendMail({ from: 'no-reply@store.com', to, subject, text });
};