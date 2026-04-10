import pool from '../config/database.js'; 

// Get all PCs with optional filtering
export const getAllPCs = async (req, res) => {
  try {
    const { cafe_id, branch_id, is_active } = req.query;
    let query = `
      SELECT p.*, 
             c.name as cafe_name,
             b.name as branch_name
      FROM pcs p
      LEFT JOIN cafes c ON p.cafe_id = c.cafe_id
      LEFT JOIN branches b ON p.branch_id = b.branch_id
      WHERE 1=1
    `;
    const queryParams = [];
    let paramCounter = 1;

    if (cafe_id) {
      query += ` AND p.cafe_id = $${paramCounter++}`;
      queryParams.push(cafe_id);
    }
    if (branch_id) {
      query += ` AND p.branch_id = $${paramCounter++}`;
      queryParams.push(branch_id);
    }
    if (is_active !== undefined) {
      query += ` AND p.is_active = $${paramCounter++}`;
      queryParams.push(is_active === 'true');
    }

    query += ` ORDER BY p.created_at DESC`;

    const result = await pool.query(query, queryParams);
    
    res.status(200).json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching PCs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching PCs',
      error: error.message
    });
  }
};

// Get PC by ID
export const getPCById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT p.*, 
             c.name as cafe_name,
             b.name as branch_name
      FROM pcs p
      LEFT JOIN cafes c ON p.cafe_id = c.cafe_id
      LEFT JOIN branches b ON p.branch_id = b.branch_id
      WHERE p.pc_id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'PC not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching PC:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching PC',
      error: error.message
    });
  }
};

// Create new PC
export const createPC = async (req, res) => {
  try {
    const { cafe_id, branch_id, name, ip_address, mac_address, is_active } = req.body;
    
    // Validate required fields
    if (!cafe_id || !branch_id || !name || !ip_address || !mac_address) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: cafe_id, branch_id, name, ip_address, mac_address'
      });
    }
    
    // Check if cafe exists
    const cafeCheck = await pool.query('SELECT cafe_id FROM cafes WHERE cafe_id = $1', [cafe_id]);
    if (cafeCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cafe not found'
      });
    }
    
    // Check if branch exists
    const branchCheck = await pool.query('SELECT branch_id FROM branches WHERE branch_id = $1', [branch_id]);
    if (branchCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found'
      });
    }
    
    // Check if IP or MAC address already exists
    const existingCheck = await pool.query(
      'SELECT pc_id FROM pcs WHERE ip_address = $1 OR mac_address = $2',
      [ip_address, mac_address]
    );
    if (existingCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'PC with this IP address or MAC address already exists'
      });
    }
    
    const query = `
      INSERT INTO pcs (cafe_id, branch_id, name, ip_address, mac_address, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      cafe_id,
      branch_id,
      name,
      ip_address,
      mac_address,
      is_active !== undefined ? is_active : true
    ]);
    
    res.status(201).json({
      success: true,
      message: 'PC created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating PC:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating PC',
      error: error.message
    });
  }
};

// Update PC
export const updatePC = async (req, res) => {
  try {
    const { id } = req.params;
    const { cafe_id, branch_id, name, ip_address, mac_address, is_active } = req.body;
    
    // Check if PC exists
    const pcCheck = await pool.query('SELECT pc_id FROM pcs WHERE pc_id = $1', [id]);
    if (pcCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'PC not found'
      });
    }
    
    // Build dynamic update query
    const updates = [];
    const queryParams = [];
    let paramCounter = 1;
    
    if (cafe_id !== undefined) {
      // Check if cafe exists
      const cafeCheck = await pool.query('SELECT cafe_id FROM cafes WHERE cafe_id = $1', [cafe_id]);
      if (cafeCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Cafe not found'
        });
      }
      updates.push(`cafe_id = $${paramCounter++}`);
      queryParams.push(cafe_id);
    }
    
    if (branch_id !== undefined) {
      // Check if branch exists
      const branchCheck = await pool.query('SELECT branch_id FROM branches WHERE branch_id = $1', [branch_id]);
      if (branchCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Branch not found'
        });
      }
      updates.push(`branch_id = $${paramCounter++}`);
      queryParams.push(branch_id);
    }
    
    if (name !== undefined) {
      updates.push(`name = $${paramCounter++}`);
      queryParams.push(name);
    }
    
    if (ip_address !== undefined) {
      // Check if IP address already exists for another PC
      const ipCheck = await pool.query(
        'SELECT pc_id FROM pcs WHERE ip_address = $1 AND pc_id != $2',
        [ip_address, id]
      );
      if (ipCheck.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'PC with this IP address already exists'
        });
      }
      updates.push(`ip_address = $${paramCounter++}`);
      queryParams.push(ip_address);
    }
    
    if (mac_address !== undefined) {
      // Check if MAC address already exists for another PC
      const macCheck = await pool.query(
        'SELECT pc_id FROM pcs WHERE mac_address = $1 AND pc_id != $2',
        [mac_address, id]
      );
      if (macCheck.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'PC with this MAC address already exists'
        });
      }
      updates.push(`mac_address = $${paramCounter++}`);
      queryParams.push(mac_address);
    }
    
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramCounter++}`);
      queryParams.push(is_active);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }
    
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    
    const query = `
      UPDATE pcs 
      SET ${updates.join(', ')}
      WHERE pc_id = $${paramCounter}
      RETURNING *
    `;
    
    queryParams.push(id);
    
    const result = await pool.query(query, queryParams);
    
    res.status(200).json({
      success: true,
      message: 'PC updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating PC:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating PC',
      error: error.message
    });
  }
};

// Delete PC (Soft delete by setting is_active to false)
export const deletePC = async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent } = req.query;
    
    // Check if PC exists
    const pcCheck = await pool.query('SELECT pc_id FROM pcs WHERE pc_id = $1', [id]);
    if (pcCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'PC not found'
      });
    }
    
    if (permanent === 'true') {
      // Permanent delete
      await pool.query('DELETE FROM pcs WHERE pc_id = $1', [id]);
      res.status(200).json({
        success: true,
        message: 'PC permanently deleted successfully'
      });
    } else {
      // Soft delete - just deactivate
      const result = await pool.query(
        `UPDATE pcs 
         SET is_active = false, updated_at = CURRENT_TIMESTAMP 
         WHERE pc_id = $1 
         RETURNING *`,
        [id]
      );
      res.status(200).json({
        success: true,
        message: 'PC deactivated successfully',
        data: result.rows[0]
      });
    }
  } catch (error) {
    console.error('Error deleting PC:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting PC',
      error: error.message
    });
  }
};

// Restore PC (reactivate soft-deleted PC)
export const restorePC = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `UPDATE pcs 
       SET is_active = true, updated_at = CURRENT_TIMESTAMP 
       WHERE pc_id = $1 AND is_active = false
       RETURNING *`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'PC not found or already active'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'PC restored successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error restoring PC:', error);
    res.status(500).json({
      success: false,
      message: 'Error restoring PC',
      error: error.message
    });
  }
};

// Get PCs by branch
export const getPCsByBranch = async (req, res) => {
  try {
    const { branchId } = req.params;
    
    const query = `
      SELECT p.*, c.name as cafe_name
      FROM pcs p
      LEFT JOIN cafes c ON p.cafe_id = c.cafe_id
      WHERE p.branch_id = $1
      ORDER BY p.name ASC
    `;
    
    const result = await pool.query(query, [branchId]);
    
    res.status(200).json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching PCs by branch:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching PCs by branch',
      error: error.message
    });
  }
};

// Get active PCs only
export const getActivePCs = async (req, res) => {
  try {
    const { cafe_id, branch_id } = req.query;
    let query = `
      SELECT p.*, 
             c.name as cafe_name,
             b.name as branch_name
      FROM pcs p
      LEFT JOIN cafes c ON p.cafe_id = c.cafe_id
      LEFT JOIN branches b ON p.branch_id = b.branch_id
      WHERE p.is_active = true
    `;
    const queryParams = [];
    let paramCounter = 1;
    
    if (cafe_id) {
      query += ` AND p.cafe_id = $${paramCounter++}`;
      queryParams.push(cafe_id);
    }
    if (branch_id) {
      query += ` AND p.branch_id = $${paramCounter++}`;
      queryParams.push(branch_id);
    }
    
    query += ` ORDER BY p.name ASC`;
    
    const result = await pool.query(query, queryParams);
    
    res.status(200).json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching active PCs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching active PCs',
      error: error.message
    });
  }
};