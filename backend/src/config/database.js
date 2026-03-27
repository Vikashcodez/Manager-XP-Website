import pg from 'pg';
import dotenv from './env.js';

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Test database connection and create tables
export const initializeDatabase = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        name VARCHAR(255) NOT NULL,
        address JSONB NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // subscription plans table
    await client.query(`
      CREATE TABLE IF NOT EXISTS subscription_plans (
        sub_id SERIAL PRIMARY KEY,
        subs_software VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        max_branches INTEGER NOT NULL,
        is_single_pc_price BOOLEAN DEFAULT FALSE,
        max_pcs INTEGER NOT NULL,
        games_allowed JSONB,
        is_telmetry_enabled BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    //cafe table
    await client.query(`
      CREATE TABLE IF NOT EXISTS cafes (
        cafe_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        user_designation VARCHAR(255) NOT NULL,
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    //branch table
    await client.query(`
      CREATE TABLE IF NOT EXISTS branches (
        branch_id SERIAL PRIMARY KEY,
        cafe_id INTEGER REFERENCES cafes(cafe_id) ON DELETE CASCADE,
        street VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        state VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL,
        zip_code VARCHAR(20) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    
    console.log('✅ Users table created/verified');
    
    client.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

export default pool;