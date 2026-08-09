const express = require('express');
const path = require('path');
const config = require('../Backend_Application/Configuration/config');

// Middleware
const cors = require('../Security_Layer/cors');
const helmet = require('../Security_Layer/helmet');
const xss = require('../Security_Layer/xssProtection');
const logger = require('../Monitoring_Logging/morgan');
const rateLimit = require('../Backend_Application/Middleware/rateLimit.middleware');
const errorHandler = require('../Backend_Application/Middleware/error.middleware');

// Routes
const authRoutes = require('../Backend_Application/Routes/auth.routes');
const healthRoutes = require('../Monitoring_Logging/health.routes');
const v1Routes = require('./API_Versioning/v1.routes');
const v2Routes = require('./API_Versioning/v2.routes');
const productRoutes = require('../Backend_Application/Routes/product.routes');

const app = express();

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../public')));

app.use(express.json());
app.use(cors);
app.use(helmet);
app.use(xss);
app.use(logger);
app.use('/api', rateLimit);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);
app.use('/', healthRoutes);

app.use(errorHandler);

const sequelize = require('../Backend_Application/Configuration/database');

sequelize.sync().then(() => {
  app.listen(config.port, () => {
    console.log(`API Gateway running on port ${config.port}`);
    console.log('Database synced successfully');
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
});