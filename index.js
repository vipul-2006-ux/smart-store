const app = require('./src/app');
const config = require('./Backend_Application/Configuration/config');
const sequelize = require('./Backend_Application/Configuration/database');

// Render requires the server to bind to process.env.PORT, which is usually handled in config
// but let's make doubly sure here.
const port = process.env.PORT || config.port || 8080;

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`SmartStore API running on port ${port}`);
    console.log('Database synced successfully');
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
});
