import pool from '../config/database.js'; 

// Create a new subscription plan
export const createSubscriptionPlan = async (req, res) => {
  try {
    const { name, max_branches, max_pcs, is_telmetry_enabled, is_active } = req.body;

    // Validate required fields
    if (!name || !max_branches || !max_pcs) {
      return res.status(400).json({
        success: false,
        message: 'Name, max_branches, and max_pcs are required fields'
      });
    }

    const query = `
      INSERT INTO subscription_plans 
      (name, max_branches, max_pcs, is_telmetry_enabled, is_active) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;

    const values = [
      name, 
      max_branches, 
      max_pcs, 
      is_telmetry_enabled || false, 
      is_active !== undefined ? is_active : true
    ];

    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: 'Subscription plan created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating subscription plan:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all subscription plans
export const getAllSubscriptionPlans = async (req, res) => {
  try {
    const query = `
      SELECT * FROM subscription_plans 
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get subscription plan by ID
export const getSubscriptionPlanById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'SELECT * FROM subscription_plans WHERE sub_id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Subscription plan not found'
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching subscription plan:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update subscription plan
export const updateSubscriptionPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, max_branches, max_pcs, is_telmetry_enabled, is_active } = req.body;

    // Check if plan exists
    const checkQuery = 'SELECT * FROM subscription_plans WHERE sub_id = $1';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Subscription plan not found'
      });
    }

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCounter = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCounter}`);
      values.push(name);
      paramCounter++;
    }
    if (max_branches !== undefined) {
      updates.push(`max_branches = $${paramCounter}`);
      values.push(max_branches);
      paramCounter++;
    }
    if (max_pcs !== undefined) {
      updates.push(`max_pcs = $${paramCounter}`);
      values.push(max_pcs);
      paramCounter++;
    }
    if (is_telmetry_enabled !== undefined) {
      updates.push(`is_telmetry_enabled = $${paramCounter}`);
      values.push(is_telmetry_enabled);
      paramCounter++;
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramCounter}`);
      values.push(is_active);
      paramCounter++;
    }

    // Always update the updated_at timestamp
    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    if (updates.length === 1) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    const query = `
      UPDATE subscription_plans 
      SET ${updates.join(', ')} 
      WHERE sub_id = $${paramCounter} 
      RETURNING *
    `;
    
    values.push(id);
    const result = await pool.query(query, values);

    res.status(200).json({
      success: true,
      message: 'Subscription plan updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating subscription plan:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete subscription plan
export const deleteSubscriptionPlan = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if plan exists
    const checkQuery = 'SELECT * FROM subscription_plans WHERE sub_id = $1';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Subscription plan not found'
      });
    }

    const deleteQuery = 'DELETE FROM subscription_plans WHERE sub_id = $1 RETURNING *';
    const result = await pool.query(deleteQuery, [id]);

    res.status(200).json({
      success: true,
      message: 'Subscription plan deleted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting subscription plan:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};