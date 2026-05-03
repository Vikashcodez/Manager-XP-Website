import pool from '../config/database.js';

// Get all pc_software records
export const getAllPcSoftware = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ps.*, p.pc_name 
      FROM pc_software ps
      LEFT JOIN pcs p ON ps.pc_id = p.pc_id
      ORDER BY ps.created_at DESC
    `);
    
    res.status(200).json({
      success: true,
      data: result.rows,
      count: result.rowCount
    });
  } catch (error) {
    console.error('Error fetching pc_software:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pc_software records',
      error: error.message
    });
  }
};

// Get pc_software by ID
export const getPcSoftwareById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT ps.*, p.pc_name 
       FROM pc_software ps
       LEFT JOIN pcs p ON ps.pc_id = p.pc_id
       WHERE ps.pc_software_id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'PC software record not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching pc_software by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pc_software record',
      error: error.message
    });
  }
};

// Get all software for a specific PC
export const getSoftwareByPcId = async (req, res) => {
  try {
    const { pcId } = req.params;
    const result = await pool.query(
      `SELECT * FROM pc_software 
       WHERE pc_id = $1 
       ORDER BY created_at DESC`,
      [pcId]
    );
    
    res.status(200).json({
      success: true,
      data: result.rows,
      count: result.rowCount
    });
  } catch (error) {
    console.error('Error fetching software by PC ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch software for this PC',
      error: error.message
    });
  }
};

// Create new pc_software record
export const createPcSoftware = async (req, res) => {
  try {
    const {
      pc_id,
      software_name,
      software_path,
      software_icon,
      software_video,
      is_active
    } = req.body;
    
    // Validate required fields
    if (!pc_id || !software_name || !software_path) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: pc_id, software_name, software_path'
      });
    }
    
    const result = await pool.query(
      `INSERT INTO pc_software (
        pc_id, software_name, software_path, software_icon, 
        software_video, is_active, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *`,
      [pc_id, software_name, software_path, software_icon || null, 
       software_video || null, is_active !== undefined ? is_active : true]
    );
    
    res.status(201).json({
      success: true,
      message: 'PC software created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating pc_software:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create pc_software record',
      error: error.message
    });
  }
};

// Update pc_software record
export const updatePcSoftware = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      pc_id,
      software_name,
      software_path,
      software_icon,
      software_video,
      is_active
    } = req.body;
    
    // Check if record exists
    const checkExisting = await pool.query(
      'SELECT * FROM pc_software WHERE pc_software_id = $1',
      [id]
    );
    
    if (checkExisting.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'PC software record not found'
      });
    }
    
    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    if (pc_id !== undefined) {
      updates.push(`pc_id = $${paramCount++}`);
      values.push(pc_id);
    }
    if (software_name !== undefined) {
      updates.push(`software_name = $${paramCount++}`);
      values.push(software_name);
    }
    if (software_path !== undefined) {
      updates.push(`software_path = $${paramCount++}`);
      values.push(software_path);
    }
    if (software_icon !== undefined) {
      updates.push(`software_icon = $${paramCount++}`);
      values.push(software_icon);
    }
    if (software_video !== undefined) {
      updates.push(`software_video = $${paramCount++}`);
      values.push(software_video);
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramCount++}`);
      values.push(is_active);
    }
    
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    
    if (updates.length === 1) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }
    
    values.push(id);
    const query = `
      UPDATE pc_software 
      SET ${updates.join(', ')}
      WHERE pc_software_id = $${paramCount}
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    
    res.status(200).json({
      success: true,
      message: 'PC software updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating pc_software:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update pc_software record',
      error: error.message
    });
  }
};

// Delete pc_software record
export const deletePcSoftware = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if record exists
    const checkExisting = await pool.query(
      'SELECT * FROM pc_software WHERE pc_software_id = $1',
      [id]
    );
    
    if (checkExisting.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'PC software record not found'
      });
    }
    
    await pool.query(
      'DELETE FROM pc_software WHERE pc_software_id = $1',
      [id]
    );
    
    res.status(200).json({
      success: true,
      message: 'PC software deleted successfully',
      data: checkExisting.rows[0]
    });
  } catch (error) {
    console.error('Error deleting pc_software:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete pc_software record',
      error: error.message
    });
  }
};

// Toggle active status
export const togglePcSoftwareStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `UPDATE pc_software 
       SET is_active = NOT is_active, 
           updated_at = CURRENT_TIMESTAMP 
       WHERE pc_software_id = $1 
       RETURNING *`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'PC software record not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: `PC software ${result.rows[0].is_active ? 'activated' : 'deactivated'} successfully`,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error toggling pc_software status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle pc_software status',
      error: error.message
    });
  }
};