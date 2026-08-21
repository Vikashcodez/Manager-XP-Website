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
      // No fallback secret: env.js requires JWT_SECRET at boot, and signing
      // with a well-known literal would make every customer token forgeable.
      process.env.JWT_SECRET,
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
      // No fallback secret: env.js requires JWT_SECRET at boot, and signing
      // with a well-known literal would make every customer token forgeable.
      process.env.JWT_SECRET,
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
/*
 * Staff-facing directory endpoints.
 *
 * These expose other people's contact details, so both are behind a staff
 * token. Passwords are never selected.
 */

const CUSTOMER_FIELDS = `
  c.customer_id, c.customer_name, c.email, c.phone_number,
  c.address, c.created_at, c.updated_at
`;

const shapeCustomer = (row) => ({
  customer_id: row.customer_id,
  customer_name: row.customer_name,
  email: row.email,
  phone_number: row.phone_number,
  address: row.address,
  created_at: row.created_at,
  updated_at: row.updated_at,
  // Present whenever the wallet row exists; null means no wallet opened yet.
  wallet_balance: row.wallet_balance === null || row.wallet_balance === undefined
    ? null
    : Number(row.wallet_balance),
  wallet_currency: row.wallet_currency || null
});

/*
 * Staff registering a walk-in at the counter.
 *
 * Deliberately looser than self-registration: the person is standing there, so
 * an address is optional and the only hard requirements are a name and a way to
 * find them again. The wallet is opened in the same transaction, because a
 * counter-registered customer is usually about to be topped up.
 */
// POST /api/customers   { customer_name, phone_number, email?, password?, address? }
export const createCustomer = async (req, res) => {
  const client = await pool.connect();
  try {
    const name = (req.body?.customer_name || '').trim();
    const phone = (req.body?.phone_number || '').trim();
    const email = (req.body?.email || '').trim().toLowerCase();
    const password = req.body?.password || '';
    const address = normalizeAddress(req.body?.address);
    const openingBalance = Number(req.body?.opening_balance || 0);

    if (!name) {
      return res.status(400).json({ success: false, message: 'A name is required' });
    }
    if (!phone || phone.length < 10) {
      return res.status(400).json({ success: false, message: 'A mobile number of at least 10 digits is required' });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'That email address is not valid' });
    }
    // A password is only needed if they will sign in on a station themselves.
    if (password && password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }
    if (!Number.isFinite(openingBalance) || openingBalance < 0) {
      return res.status(400).json({ success: false, message: 'Opening balance must be zero or more' });
    }

    // The customers table requires an email, so stand one in when staff did not
    // collect one. The mobile number keeps it unique and recognisable.
    const loginEmail = email || `${phone.replace(/\D/g, '')}@walkin.local`;

    const clash = await client.query(
      'SELECT customer_id FROM customers WHERE email = $1 OR phone_number = $2',
      [loginEmail, phone]
    );
    if (clash.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'A customer with that email or mobile number already exists'
      });
    }

    await client.query('BEGIN');

    const hashed = await bcrypt.hash(password || Math.random().toString(36).slice(2) + Date.now(), 10);
    const inserted = await client.query(
      `INSERT INTO customers (customer_name, email, phone_number, password, address)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING ${CUSTOMER_FIELDS.replace(/c\./g, '')}`,
      [name, loginEmail, phone, hashed, address]
    );
    const customer = inserted.rows[0];

    const wallet = await client.query(
      `INSERT INTO wallets (customer_id, balance) VALUES ($1, $2)
       RETURNING wallet_id, balance, currency`,
      [customer.customer_id, openingBalance.toFixed(2)]
    );

    if (openingBalance > 0) {
      await client.query(
        `INSERT INTO wallet_transactions
           (wallet_id, customer_id, direction, amount, balance_after, category, note, performed_by)
         VALUES ($1,$2,'credit',$3,$4,'topup','Opening balance at registration',$5)`,
        [wallet.rows[0].wallet_id, customer.customer_id,
         openingBalance.toFixed(2), openingBalance.toFixed(2),
         req.user?.email || 'staff']
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Customer added',
      data: shapeCustomer({
        ...customer,
        wallet_balance: wallet.rows[0].balance,
        wallet_currency: wallet.rows[0].currency
      }),
      // Staff need to be told when the customer cannot sign in yet.
      note: password
        ? null
        : 'No password was set — this customer cannot sign in on a station until one is added.'
    });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Error creating customer:', error);
    res.status(500).json({ success: false, message: 'Error creating customer' });
  } finally {
    client.release();
  }
};

// GET /api/customers?search=&limit=&offset=
export const getCustomers = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
    const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);
    const search = (req.query.search || '').trim();

    const params = [];
    let where = '';

    if (search) {
      // One box searches name, email and phone — how staff actually look
      // someone up at the counter.
      params.push(`%${search}%`);
      where = `WHERE c.customer_name ILIKE $1 OR c.email ILIKE $1 OR c.phone_number ILIKE $1`;
    }

    const listParams = [...params, limit, offset];
    const result = await pool.query(
      `SELECT ${CUSTOMER_FIELDS},
              w.balance AS wallet_balance,
              w.currency AS wallet_currency
       FROM customers c
       LEFT JOIN wallets w ON w.customer_id = c.customer_id
       ${where}
       ORDER BY c.created_at DESC
       LIMIT $${listParams.length - 1} OFFSET $${listParams.length}`,
      listParams
    );

    const totalResult = await pool.query(
      `SELECT COUNT(*)::int AS count FROM customers c ${where}`,
      params
    );

    res.status(200).json({
      success: true,
      data: result.rows.map(shapeCustomer),
      pagination: { limit, offset, total: totalResult.rows[0].count }
    });
  } catch (error) {
    console.error('Error listing customers:', error);
    res.status(500).json({ success: false, message: 'Error fetching customers' });
  }
};

// GET /api/customers/:id
export const getCustomerById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, message: 'Invalid customer id' });
    }

    const result = await pool.query(
      `SELECT ${CUSTOMER_FIELDS},
              w.balance AS wallet_balance,
              w.currency AS wallet_currency
       FROM customers c
       LEFT JOIN wallets w ON w.customer_id = c.customer_id
       WHERE c.customer_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.status(200).json({ success: true, data: shapeCustomer(result.rows[0]) });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ success: false, message: 'Error fetching customer' });
  }
};
