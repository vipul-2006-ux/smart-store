const sequelize = require('../Backend_Application/Configuration/database');
const User = require('../Backend_Application/Models/User');

async function seed() {
  try {
    console.log('Connecting to database and syncing...');
    await sequelize.sync({ force: true }); // Warning: This drops all tables!
    
    console.log('Seeding Users...');
    
    // The beforeCreate hook in User.js will automatically hash the 'vip2000' password!
    await User.create({
      username: 'vipul_1005',
      email: 'vipul@example.com',
      password: 'vip2000',
      role: 'USER'
    });

    await User.create({
      username: 'admin_user',
      email: 'admin@smartstore.com',
      password: 'vip2000',
      role: 'ADMIN'
    });

    console.log('✅ Seeding complete! You can now log in with vipul_1005 and vip2000.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
