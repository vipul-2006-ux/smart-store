const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const config = require('../Backend_Application/Configuration/config');

const pool = new Pool({
  connectionString: config.db.url || 'postgres://postgres:postgres@localhost:5432/smartstore'
});

async function seed() {
  try {
    console.log('Connecting to database...');
    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE,
        email VARCHAR(100) UNIQUE,
        password VARCHAR(255),
        role VARCHAR(20) DEFAULT 'USER'
      );
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100)
      );
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        category_id INT REFERENCES categories(id),
        name VARCHAR(100),
        price DECIMAL(10,2)
      );
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        total_amount DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const uvanPass = await bcrypt.hash('uvan2000', 10);
    const vipulPass = await bcrypt.hash('vip2000', 10);
    
    await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) ON CONFLICT (username) DO NOTHING',
      ['uvan_1005', 'admin@store.com', uvanPass, 'ADMIN']
    );
    await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) ON CONFLICT (username) DO NOTHING',
      ['vipul_1005', 'user@store.com', vipulPass, 'USER']
    );

    await pool.query("INSERT INTO categories (name) VALUES ('Electronics'), ('Clothing') ON CONFLICT DO NOTHING");
    await pool.query("INSERT INTO products (category_id, name, price) VALUES (1, 'Premium Laptop', 999.99), (1, 'Smart Watch', 199.99) ON CONFLICT DO NOTHING");

    console.log('Seeding complete!');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    pool.end();
  }
}

seed();
