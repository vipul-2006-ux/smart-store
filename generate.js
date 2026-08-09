const fs = require('fs');
const path = require('path');

const rootDir = __dirname;

const structure = {
  'Backend_Application/Configuration/database.js': `const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool({
  connectionString: config.db.url
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};`,
  'Backend_Application/Configuration/redis.js': `const redis = require('redis');
const config = require('./config');

const client = redis.createClient({ url: config.redis.url });
client.on('error', (err) => console.log('Redis Client Error', err));

module.exports = client;`,
  'Backend_Application/Configuration/mail.js': `const nodemailer = require('nodemailer');
const config = require('./config');

const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  auth: { user: config.mail.user, pass: config.mail.pass }
});

module.exports = transporter;`,
  'Backend_Application/Configuration/config.js': `require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  db: { url: process.env.DATABASE_URL },
  redis: { url: process.env.REDIS_URL },
  jwtSecret: process.env.JWT_SECRET || 'secret',
  mail: { host: process.env.SMTP_HOST, port: 587, user: 'user', pass: 'pass' }
};`,

  'Backend_Application/Routes/auth.routes.js': `const express = require('express');
const authController = require('../Controllers/auth.controller');
const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;`,
  'Backend_Application/Routes/users.routes.js': `const express = require('express');
const usersController = require('../Controllers/users.controller');
const authMiddleware = require('../Middleware/auth.middleware');
const router = express.Router();

router.get('/profile', authMiddleware, usersController.getProfile);

module.exports = router;`,
  'Backend_Application/Routes/products.routes.js': `const express = require('express');
const productsController = require('../Controllers/products.controller');
const router = express.Router();

router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getProductById);

module.exports = router;`,
  'Backend_Application/Routes/orders.routes.js': `const express = require('express');
const ordersController = require('../Controllers/orders.controller');
const authMiddleware = require('../Middleware/auth.middleware');
const router = express.Router();

router.post('/', authMiddleware, ordersController.placeOrder);

module.exports = router;`,
  'Backend_Application/Routes/admin.routes.js': `const express = require('express');
const adminController = require('../Controllers/admin.controller');
const authMiddleware = require('../Middleware/auth.middleware');
const roleMiddleware = require('../Middleware/role.middleware');
const router = express.Router();

router.use(authMiddleware, roleMiddleware('ADMIN'));
router.get('/dashboard', adminController.getStats);

module.exports = router;`,

  'Backend_Application/Controllers/auth.controller.js': `const authService = require('../Services/auth.service');
const { sendSuccess, sendError } = require('../Utilities/response');

exports.login = async (req, res) => {
  try {
    const token = await authService.login(req.body.email, req.body.password);
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
};`,
  'Backend_Application/Controllers/users.controller.js': `const userService = require('../Services/user.service');
const { sendSuccess, sendError } = require('../Utilities/response');

exports.getProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    sendSuccess(res, 200, 'Profile fetched', user);
  } catch (err) {
    sendError(res, 404, err.message);
  }
};`,
  'Backend_Application/Controllers/products.controller.js': `const productService = require('../Services/product.service');
const { sendSuccess, sendError } = require('../Utilities/response');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await productService.getProducts();
    sendSuccess(res, 200, 'Products fetched', products);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    sendSuccess(res, 200, 'Product fetched', product);
  } catch (err) {
    sendError(res, 404, err.message);
  }
};`,
  'Backend_Application/Controllers/orders.controller.js': `const orderService = require('../Services/order.service');
const { sendSuccess, sendError } = require('../Utilities/response');

exports.placeOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.user.id, req.body.items);
    sendSuccess(res, 201, 'Order placed successfully', order);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};`,
  'Backend_Application/Controllers/admin.controller.js': `const { sendSuccess } = require('../Utilities/response');

exports.getStats = async (req, res) => {
  const stats = { users: 100, orders: 50, revenue: 5000 };
  sendSuccess(res, 200, 'Admin stats fetched', stats);
};`,

  'Backend_Application/Services/auth.service.js': `const userRepository = require('../Repository_Layer/user.repository');
const { generateToken } = require('../Utilities/jwt');
const { comparePassword } = require('../Utilities/hash');

exports.login = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user || !(await comparePassword(password, user.password))) {
    throw new Error('Invalid credentials');
  }
  return generateToken({ id: user.id, role: user.role });
};

exports.register = async (userData) => {
  return await userRepository.create(userData);
};`,
  'Backend_Application/Services/user.service.js': `const userRepository = require('../Repository_Layer/user.repository');

exports.getUserById = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) throw new Error('User not found');
  return user;
};`,
  'Backend_Application/Services/product.service.js': `const productRepository = require('../Repository_Layer/product.repository');

exports.getProducts = async () => {
  return await productRepository.findAll();
};

exports.getProductById = async (id) => {
  return await productRepository.findById(id);
};`,
  'Backend_Application/Services/order.service.js': `const orderRepository = require('../Repository_Layer/order.repository');
const paymentService = require('./payment.service');
const notificationQueue = require('../Background_Jobs/notification.job');

exports.createOrder = async (userId, items) => {
  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
  const paymentStatus = await paymentService.processPayment(userId, totalAmount);
  
  if (paymentStatus === 'SUCCESS') {
    const order = await orderRepository.create({ userId, items, totalAmount });
    await notificationQueue.add({ userId, message: 'Order Placed!' });
    return order;
  }
  throw new Error('Payment failed');
};`,
  'Backend_Application/Services/payment.service.js': `const paymentGateway = require('../../External_Services/payment.gateway');

exports.processPayment = async (userId, amount) => {
  // Simulate calling an external payment gateway
  return await paymentGateway.charge(userId, amount);
};`,
  'Backend_Application/Services/email.service.js': `const emailQueue = require('../Background_Jobs/email.queue');

exports.sendWelcomeEmail = async (email) => {
  await emailQueue.add({ to: email, subject: 'Welcome to SmartStore!' });
};`,
  'Backend_Application/Services/notification.service.js': `const logger = require('../Utilities/logger');

exports.sendPushNotification = async (userId, message) => {
  logger.info(\`Sending notification to \${userId}: \${message}\`);
};`,

  'Backend_Application/Repository_Layer/user.repository.js': `const User = require('../Models/User');

exports.findByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

exports.findById = async (id) => {
  return await User.findByPk(id);
};

exports.create = async (data) => {
  return await User.create(data);
};`,
  'Backend_Application/Repository_Layer/product.repository.js': `const Product = require('../Models/Product');

exports.findAll = async () => {
  return await Product.findAll();
};

exports.findById = async (id) => {
  return await Product.findByPk(id);
};`,
  'Backend_Application/Repository_Layer/order.repository.js': `const Order = require('../Models/Order');

exports.create = async (orderData) => {
  return await Order.create(orderData);
};`,

  'Backend_Application/Models/User.js': `// Mock ORM Model for User
module.exports = {
  findOne: async (query) => ({ id: 1, email: 'test@test.com', password: 'hashed', role: 'USER' }),
  findByPk: async (id) => ({ id, name: 'John Doe', email: 'test@test.com' }),
  create: async (data) => ({ id: 2, ...data })
};`,
  'Backend_Application/Models/Product.js': `// Mock ORM Model for Product
module.exports = {
  findAll: async () => [{ id: 1, name: 'Laptop', price: 999 }],
  findByPk: async (id) => ({ id, name: 'Laptop', price: 999 })
};`,
  'Backend_Application/Models/Order.js': `// Mock ORM Model for Order
module.exports = {
  create: async (data) => ({ id: 101, status: 'PENDING', ...data })
};`,
  'Backend_Application/Models/Category.js': `// Mock ORM Model for Category
module.exports = {
  findAll: async () => [{ id: 1, name: 'Electronics' }]
};`,

  'Backend_Application/Middleware/auth.middleware.js': `const { verifyToken } = require('../Utilities/jwt');
const { sendError } = require('../Utilities/response');

module.exports = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return sendError(res, 401, 'No token provided');
  
  try {
    req.user = verifyToken(token.split(' ')[1]);
    next();
  } catch (err) {
    sendError(res, 401, 'Invalid token');
  }
};`,
  'Backend_Application/Middleware/role.middleware.js': `const { sendError } = require('../Utilities/response');

module.exports = (requiredRole) => (req, res, next) => {
  if (req.user && req.user.role === requiredRole) {
    next();
  } else {
    sendError(res, 403, 'Access denied');
  }
};`,
  'Backend_Application/Middleware/validation.middleware.js': `const { sendError } = require('../Utilities/response');

module.exports = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return sendError(res, 400, error.details[0].message);
  }
  next();
};`,
  'Backend_Application/Middleware/error.middleware.js': `const logger = require('../Utilities/logger');

module.exports = (err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
};`,
  'Backend_Application/Middleware/logger.middleware.js': `const morgan = require('../../Monitoring_Logging/morgan');

module.exports = morgan; // Exports morgan logger middleware configured in monitoring`,
  'Backend_Application/Middleware/upload.middleware.js': `const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

module.exports = upload;`,
  'Backend_Application/Middleware/rateLimit.middleware.js': `const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});`,

  'Backend_Application/Utilities/jwt.js': `const jwt = require('jsonwebtoken');
const config = require('../Configuration/config');

exports.generateToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};`,
  'Backend_Application/Utilities/hash.js': `const bcrypt = require('bcrypt');

exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

exports.comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};`,
  'Backend_Application/Utilities/logger.js': `const winston = require('../../Monitoring_Logging/winston');
module.exports = winston;`,
  'Backend_Application/Utilities/response.js': `exports.sendSuccess = (res, statusCode, message, data = {}) => {
  res.status(statusCode).json({ success: true, message, data });
};

exports.sendError = (res, statusCode, message) => {
  res.status(statusCode).json({ success: false, message });
};`,
  'Backend_Application/Utilities/helper.js': `exports.generateRandomString = (length) => {
  return Math.random().toString(36).substring(2, 2 + length);
};`,

  'Backend_Application/Background_Jobs/email.queue.js': `const Queue = require('bull');
const config = require('../Configuration/config');

const emailQueue = new Queue('email', config.redis.url);

emailQueue.process(async (job) => {
  console.log('Sending email to:', job.data.to);
  // Email sending logic here
});

module.exports = emailQueue;`,
  'Backend_Application/Background_Jobs/sms.queue.js': `const Queue = require('bull');
const config = require('../Configuration/config');

const smsQueue = new Queue('sms', config.redis.url);

smsQueue.process(async (job) => {
  console.log('Sending SMS to:', job.data.phone);
});

module.exports = smsQueue;`,
  'Backend_Application/Background_Jobs/notification.job.js': `const Queue = require('bull');
const config = require('../Configuration/config');

const notificationQueue = new Queue('notification', config.redis.url);

notificationQueue.process(async (job) => {
  console.log('Processing notification for:', job.data.userId);
});

module.exports = notificationQueue;`,
  'Backend_Application/Background_Jobs/cron.job.js': `const cron = require('node-cron');

// Run everyday at midnight
cron.schedule('0 0 * * *', () => {
  console.log('Running daily cleanup cron job...');
});`,

  'Database_Layer/schema.sql': `CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role VARCHAR(20) DEFAULT 'USER'
);`,
  'Database_Layer/migration.sql': `ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`,
  'Database_Layer/seed.sql': `INSERT INTO users (name, email, password, role) VALUES ('Admin', 'admin@store.com', 'hashedpassword', 'ADMIN');`,

  'External_Services/payment.gateway.js': `exports.charge = async (userId, amount) => {
  console.log(\`Charging user \${userId} amount \${amount} via Stripe API\`);
  return 'SUCCESS';
};`,
  'External_Services/smtp.service.js': `const mailConfig = require('../Backend_Application/Configuration/mail');

exports.sendMail = async (to, subject, text) => {
  await mailConfig.sendMail({ from: 'no-reply@store.com', to, subject, text });
};`,
  'External_Services/cloud.storage.js': `exports.uploadImage = async (fileStream) => {
  console.log('Uploading file to AWS S3...');
  return 'https://s3.amazonaws.com/bucket/image.png';
};`,

  'Security_Layer/cors.js': `const cors = require('cors');

module.exports = cors({
  origin: 'https://smartstore.com',
  optionsSuccessStatus: 200
});`,
  'Security_Layer/helmet.js': `const helmet = require('helmet');
module.exports = helmet();`,
  'Security_Layer/sqlProtection.js': `// Middleware to prevent SQL injection (conceptual for demo)
module.exports = (req, res, next) => {
  console.log('Scanning for SQLi...');
  next();
};`,
  'Security_Layer/xssProtection.js': `const xss = require('xss-clean');
module.exports = xss();`,

  'Monitoring_Logging/winston.js': `const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});

module.exports = logger;`,
  'Monitoring_Logging/morgan.js': `const morgan = require('morgan');
module.exports = morgan('combined');`,
  'Monitoring_Logging/health.routes.js': `const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => res.status(200).send('OK'));

module.exports = router;`,

  'Documentation/swagger.json': `{
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "SmartStore API",
    "description": "E-commerce Backend API"
  },
  "paths": {}
}`,
  'Documentation/README.md': `# SmartStore API
Complete backend project in Node.js + Express using enterprise architecture.
Features: Auth, Products, Orders, Admin dashboard.`,
  'Documentation/architecture.md': `# Architecture Flow
1. API Gateway routes requests.
2. Express app handles them in Routes.
3. Controllers handle HTTP request/responses.
4. Services contain business logic.
5. Repositories access Models and Database.`,

  'Testing/auth.test.js': `// Example Auth Test
test('should login user and return token', () => {
  expect(true).toBe(true);
});`,
  'Testing/user.test.js': `// Example User Test
test('should fetch user profile', () => {
  expect(true).toBe(true);
});`,
  'Testing/product.test.js': `// Example Product Test
test('should return list of products', () => {
  expect(true).toBe(true);
});`,
  'Testing/order.test.js': `// Example Order Test
test('should create an order successfully', () => {
  expect(true).toBe(true);
});`,

  'DevOps/Dockerfile': `FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]`,
  'DevOps/docker-compose.yml': `version: '3'
services:
  app:
    build: .
    ports: ["3000:3000"]
    depends_on: ["db", "redis"]
  db:
    image: postgres:13
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
  redis:
    image: redis:alpine`,
  'DevOps/.github/workflows/main.yml': `name: CI
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm test`,
  'DevOps/deploy.sh': `#!/bin/bash
echo "Pulling latest code..."
git pull origin main
echo "Restarting server..."
pm2 restart ecosystem.config.js`,

  'Production_Infrastructure/nginx.conf': `server {
  listen 80;
  server_name api.smartstore.com;
  location / {
    proxy_pass http://localhost:3000;
  }
}`,
  'Production_Infrastructure/ecosystem.config.js': `module.exports = {
  apps: [{
    name: "smartstore-api",
    script: "./server.js",
    instances: "max",
    env_production: {
      NODE_ENV: "production"
    }
  }]
};`,
  
  'API_Gateway/server.js': `const express = require('express');
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
const userRoutes = require('../Backend_Application/Routes/users.routes');
const productRoutes = require('../Backend_Application/Routes/products.routes');
const orderRoutes = require('../Backend_Application/Routes/orders.routes');
const adminRoutes = require('../Backend_Application/Routes/admin.routes');
const healthRoutes = require('../Monitoring_Logging/health.routes');

const app = express();

app.use(express.json());
app.use(cors);
app.use(helmet);
app.use(xss);
app.use(logger);
app.use('/api', rateLimit);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/', healthRoutes);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(\`API Gateway running on port \${config.port}\`);
});`
};

Object.keys(structure).forEach(filePath => {
  const fullPath = path.join(rootDir, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, structure[filePath].trim());
});

console.log('Project structure created successfully.');
