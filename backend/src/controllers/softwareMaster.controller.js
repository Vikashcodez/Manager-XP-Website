import pool from '../config/database.js';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import { fileTypeFromFile } from 'file-type';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    // Create uploads directory if it doesn't exist
    fs.mkdir(uploadDir, { recursive: true })
      .then(() => cb(null, uploadDir))
      .catch(err => cb(err));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter for images and videos
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'software_icon') {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for icon!'), false);
    }
  } else if (file.fieldname === 'software_video') {
    // Accept video files
    const allowedVideoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];
    if (allowedVideoTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only video files (MP4, MPEG, MOV, AVI) are allowed!'), false);
    }
  } else {
    cb(new Error('Unexpected field'), false);
  }
};

// Configure multer for file uploads
export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit for videos
  }
}).fields([
  { name: 'software_icon', maxCount: 1 },
  { name: 'software_video', maxCount: 1 }
]);

// Helper function to optimize image
async function optimizeImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .resize(500, 500, { // Resize to 500x500 max
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toFile(outputPath);
    
    // Delete original file
    await fs.unlink(inputPath);
    return true;
  } catch (error) {
    console.error('Error optimizing image:', error);
    return false;
  }
}

// Helper function to validate video
async function validateVideo(filePath) {
  try {
    const type = await fileTypeFromFile(filePath);
    if (type && type.mime.startsWith('video/')) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

// CREATE - Add new software
export const createSoftware = async (req, res) => {
  try {
    const { software_name } = req.body;
    
    if (!software_name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Software name is required' 
      });
    }
    
    let iconPath = null;
    let videoPath = null;
    
    // Process uploaded icon
    if (req.files && req.files.software_icon) {
      const iconFile = req.files.software_icon[0];
      const optimizedFilename = `optimized-${path.basename(iconFile.filename)}`;
      const optimizedPath = path.join(iconFile.destination, optimizedFilename);
      
      await optimizeImage(iconFile.path, optimizedPath);
      iconPath = `/uploads/${optimizedFilename}`;
    }
    
    // Process uploaded video
    if (req.files && req.files.software_video) {
      const videoFile = req.files.software_video[0];
      const isValid = await validateVideo(videoFile.path);
      
      if (!isValid) {
        // Delete invalid video
        await fs.unlink(videoFile.path);
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid video file format' 
        });
      }
      videoPath = `/uploads/${videoFile.filename}`;
    }
    
    const result = await pool.query(
      `INSERT INTO software_master (software_name, software_icon, software_video) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [software_name, iconPath, videoPath]
    );
    
    res.status(201).json({
      success: true,
      message: 'Software created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating software:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// READ - Get all software (with pagination)
export const getAllSoftware = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Get total count
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM software_master WHERE is_active = true'
    );
    const totalCount = parseInt(countResult.rows[0].count);
    
    // Get paginated data
    const result = await pool.query(
      `SELECT software_id, software_name, software_icon, software_video, 
              is_active, created_at, updated_at 
       FROM software_master 
       WHERE is_active = true 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    
    res.status(200).json({
      success: true,
      data: result.rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Error fetching software:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// READ - Get single software by ID
export const getSoftwareById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT software_id, software_name, software_icon, software_video, 
              is_active, created_at, updated_at 
       FROM software_master 
       WHERE software_id = $1 AND is_active = true`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Software not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching software:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Helper function to delete old files
async function deleteOldFiles(filePaths) {
  for (const filePath of filePaths) {
    if (filePath) {
      const fullPath = path.join(__dirname, '..', filePath);
      try {
        await fs.access(fullPath);
        await fs.unlink(fullPath);
      } catch (err) {
        console.log(`File not found: ${fullPath}`);
      }
    }
  }
}

// UPDATE - Update software
export const updateSoftware = async (req, res) => {
  try {
    const { id } = req.params;
    const { software_name, is_active } = req.body;
    
    // Check if software exists
    const existingSoftware = await pool.query(
      'SELECT * FROM software_master WHERE software_id = $1',
      [id]
    );
    
    if (existingSoftware.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Software not found' 
      });
    }
    
    const oldData = existingSoftware.rows[0];
    let iconPath = oldData.software_icon;
    let videoPath = oldData.software_video;
    
    // Process new icon if uploaded
    if (req.files && req.files.software_icon) {
      const iconFile = req.files.software_icon[0];
      const optimizedFilename = `optimized-${path.basename(iconFile.filename)}`;
      const optimizedPath = path.join(iconFile.destination, optimizedFilename);
      
      await optimizeImage(iconFile.path, optimizedPath);
      iconPath = `/uploads/${optimizedFilename}`;
      
      // Delete old icon if exists
      if (oldData.software_icon) {
        await deleteOldFiles([oldData.software_icon]);
      }
    }
    
    // Process new video if uploaded
    if (req.files && req.files.software_video) {
      const videoFile = req.files.software_video[0];
      const isValid = await validateVideo(videoFile.path);
      
      if (!isValid) {
        await fs.unlink(videoFile.path);
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid video file format' 
        });
      }
      videoPath = `/uploads/${videoFile.filename}`;
      
      // Delete old video if exists
      if (oldData.software_video) {
        await deleteOldFiles([oldData.software_video]);
      }
    }
    
    const result = await pool.query(
      `UPDATE software_master 
       SET software_name = COALESCE($1, software_name),
           software_icon = $2,
           software_video = $3,
           is_active = COALESCE($4, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE software_id = $5
       RETURNING *`,
      [software_name || oldData.software_name, iconPath, videoPath, 
       is_active !== undefined ? is_active : oldData.is_active, id]
    );
    
    res.status(200).json({
      success: true,
      message: 'Software updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating software:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// DELETE - Soft delete software (set is_active to false)
export const deleteSoftware = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `UPDATE software_master 
       SET is_active = false, 
           updated_at = CURRENT_TIMESTAMP 
       WHERE software_id = $1 AND is_active = true
       RETURNING *`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Software not found or already deleted' 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Software deleted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting software:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// PERMANENT DELETE - Hard delete software and files
export const permanentDeleteSoftware = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get software data before deletion
    const software = await pool.query(
      'SELECT * FROM software_master WHERE software_id = $1',
      [id]
    );
    
    if (software.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Software not found' 
      });
    }
    
    // Delete associated files
    const filesToDelete = [];
    if (software.rows[0].software_icon) {
      filesToDelete.push(software.rows[0].software_icon);
    }
    if (software.rows[0].software_video) {
      filesToDelete.push(software.rows[0].software_video);
    }
    await deleteOldFiles(filesToDelete);
    
    // Delete from database
    await pool.query('DELETE FROM software_master WHERE software_id = $1', [id]);
    
    res.status(200).json({
      success: true,
      message: 'Software permanently deleted successfully'
    });
  } catch (error) {
    console.error('Error permanently deleting software:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};