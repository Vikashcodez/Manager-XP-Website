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
        name VARCHAR(255) NOT NULL,
        max_branches INTEGER NOT NULL,
        max_pcs INTEGER NOT NULL,
        is_telmetry_enabled BOOLEAN DEFAULT FALSE,
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