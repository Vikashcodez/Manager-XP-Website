import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

// Register user
export const register = async (req, res) => {
  try {
    const { email, phoneNumber, name, address, password } = req.body;

    // Check if user already exists
    const userExists = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (email, phone_number, name, address, password, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, phone_number, name, address, role, created_at`,
      [email, phoneNumber, name, JSON.stringify(address), hashedPassword, 'user']
    );

    const user = result.rows[0];

    // Get cafeId if user has a cafe
    const cafeResult = await pool.query(
      'SELECT cafe_id FROM cafes WHERE user_id = $1',
      [user.id]
    );
    
    user.cafe_id = cafeResult.rows.length > 0 ? cafeResult.rows[0].cafe_id : null;

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Login user or admin
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if it's admin login
    if (email === process.env.ADMIN_EMAIL) {
      // Verify admin password
      const isAdminPasswordValid = password === process.env.ADMIN_PASSWORD;
      
      if (!isAdminPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid admin credentials'
        });
      }

      // Admin login successful
      const token = jwt.sign(
        { 
          email: process.env.ADMIN_EMAIL, 
          role: 'admin' 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      return res.status(200).json({
        success: true,
        message: 'Admin logged in successfully',
        data: {
          user: {
            email: process.env.ADMIN_EMAIL,
            role: 'admin'
          },
          token
        }
      });
    }

    // Regular user login
    const result = await pool.query(
      'SELECT id, email, phone_number, name, address, password, role FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = result.rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Remove password from response
    delete user.password;

    // Get cafeId if user has a cafe
    const cafeResult = await pool.query(
      'SELECT cafe_id FROM cafes WHERE user_id = $1',
      [user.id]
    );
    
    user.cafe_id = cafeResult.rows.length > 0 ? cafeResult.rows[0].cafe_id : null;

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all users for admin dashboard
export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, email, phone_number, name, address, role, created_at
       FROM users
       ORDER BY created_at DESC`
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};