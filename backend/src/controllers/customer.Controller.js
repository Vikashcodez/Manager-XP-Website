import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js'; 

function normalizeAddress(address) {
  if (address && typeof address === 'object') {
    return address;
  }

  if (typeof address === 'string') {
    const trimmedAddress = address.trim();

    if (!trimmedAddress) {
      return null;
    }

    try {
      return JSON.parse(trimmedAddress);
    } catch {
      return { value: trimmedAddress };
    }
  }

  return null;
}

// Register function
export const register = async (req, res) => {
  try {
    const {
      customer_name,
      email,
      phone_number,
      password,
      address
    } = req.body;

    const normalizedAddress = normalizeAddress(address);

    // Validate required fields
    if (!customer_name || !email || !phone_number || !password || !normalizedAddress) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: customer_name, email, phone_number, password, address'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate phone number (basic validation)
    if (phone_number.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Phone number must be at least 10 characters'
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const checkUserQuery = 'SELECT email FROM customers WHERE email = $1';
    const existingUser = await pool.query(checkUserQuery, [email]);

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new customer
    const insertQuery = `
      INSERT INTO customers (customer_name, email, phone_number, password, address)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING customer_id, customer_name, email, phone_number, address, created_at, updated_at
    `;

    const values = [customer_name, email, phone_number, hashedPassword, normalizedAddress];
    const result = await pool.query(insertQuery, values);

    const newCustomer = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { 
        customer_id: newCustomer.customer_id, 
        email: newCustomer.email,
        customer_name: newCustomer.customer_name
      },
      process.env.JWT_SECRET || 'your-secret-key-change-this',
      { expiresIn: '7d' }
    );

    // Remove password from response
    delete newCustomer.password;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: newCustomer,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle unique constraint violation
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login function
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const findUserQuery = `
      SELECT customer_id, customer_name, email, phone_number, password, address, created_at, updated_at
      FROM customers 
      WHERE email = $1
    `;
    
    const result = await pool.query(findUserQuery, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = result.rows[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        customer_id: user.customer_id, 
        email: user.email,
        customer_name: user.customer_name
      },
      process.env.JWT_SECRET || 'your-secret-key-change-this',
      { expiresIn: '7d' }
    );

    // Remove password from response
    delete user.password;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};