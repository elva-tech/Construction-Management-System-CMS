// ─── AWS S3 Configuration ────────────────────────────────────────────────────
// Fill these in your .env file before deployment:
// AWS_ACCESS_KEY_ID=your_access_key
// AWS_SECRET_ACCESS_KEY=your_secret_key
// AWS_REGION=ap-south-1  (or your region)
// AWS_S3_BUCKET=your_bucket_name


const pool = require('../config/db');
const multer = require('multer');

// ─────────────────────────────────────────────
// STORAGE STRATEGY
// ─────────────────────────────────────────────
// PRODUCTION (when AWS credentials are set in .env):
//   Uncomment the S3 block below and comment out memoryStorage
//
// const multerS3 = require('multer-s3');
// const { S3Client } = require('@aws-sdk/client-s3');
// const s3Client = new S3Client({
//     region: process.env.AWS_REGION,
//     credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
//     }
// });
// const BUCKET_NAME = process.env.AWS_S3_BUCKET;
// const storage = multerS3({
//     s3: s3Client,
//     bucket: BUCKET_NAME,
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     key: (req, file, cb) => {
//         const uniqueName = `drawings/${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
//         cb(null, uniqueName);
//     }
// });
// ─────────────────────────────────────────────
// DEMO / PRE-DEPLOYMENT: memoryStorage
// File stays in memory as buffer — no local folder, no S3 needed
// file_url stored as base64 data URL in DB
// When AWS is ready: comment this out, uncomment S3 block above
const storage = multer.memoryStorage();

// File filter — only PDF and images allowed
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf',
        'image/jpeg', 'image/jpg', 'image/png',
        'image/gif', 'image/bmp', 'image/webp', 'image/tiff'
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF and image files are allowed'), false);
    }
};

// Multer upload middleware
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

exports.upload = upload;

// Create a new drawing
const createDrawing = async (req, res) => {
    try {
        const { project_id, particulars, uploaded_by, approved_by, remarks } = req.body;
        if (!project_id) {
            return res.status(400).json({
                success: false,
                message: 'Missing required field: project_id'
            });
        }

        // PRODUCTION (S3): file_url = req.file.location (S3 public URL)
        // DEMO (memoryStorage): convert buffer to base64 data URL for storage
        let file_url = null;
        if (req.file) {
            // When switching to S3: replace this block with → file_url = req.file.location;
            const base64 = req.file.buffer.toString('base64');
            file_url = `data:${req.file.mimetype};base64,${base64}`;
        }

        const query = `INSERT INTO Drawing (project_id, particulars, file_url, uploaded_by, approved_by, remarks) VALUES (?, ?, ?, ?, ?, ?)`;
        const [result] = await pool.execute(query, [
            project_id,
            particulars || null,
            file_url,
            uploaded_by || null,
            approved_by || null,
            remarks || null
        ]);

        res.status(201).json({
            success: true,
            message: 'Drawing created successfully',
            data: {
                id: result.insertId,
                project_id,
                particulars,
                file_url,
                uploaded_by,
                approved_by,
                remarks
            }
        });
    } catch (error) {
        console.error('Error creating drawing:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating drawing',
            error: error.message
        });
    }
};

// Get all drawings — filtered by project_id if provided
const getAllDrawings = async (req, res) => {
    try {
        const { project_id } = req.query;
        let drawings;
        if (project_id) {
            [drawings] = await pool.execute('SELECT * FROM Drawing WHERE project_id = ? ORDER BY id DESC', [project_id]);
        } else {
            [drawings] = await pool.execute('SELECT * FROM Drawing ORDER BY id DESC');
        }
        res.status(200).json({ success: true, data: drawings });
    } catch (error) {
        console.error('Error fetching drawings:', error);
        res.status(500).json({ success: false, message: 'Error fetching drawings', error: error.message });
    }
};

// mock to fetch drawings
// const getAllDrawings = async (req, res) => {
//     res.status(200).json({
//         success: true,
//         data: [
//             { id: 1, project_id: 1, particulars: "Basic Plan", file_url: null, uploaded_by: null, approved_by: null, remarks: null, status: "Approved" },
//             { id: 2, project_id: 1, particulars: "Plinth Beam Plan", file_url: null, uploaded_by: null, approved_by: null, remarks: null, status: "Approved" },
//             { id: 3, project_id: 1, particulars: "Site Diagram", file_url: null, uploaded_by: null, approved_by: null, remarks: null, status: "Rejected" },
//             { id: 4, project_id: 1, particulars: "Blue Print", file_url: null, uploaded_by: null, approved_by: null, remarks: null, status: "Submitted" }
//         ]
//     });
// };

// Update a drawing (with optional new file upload)
const updateDrawing = async (req, res) => {
    try {
        const { id } = req.params;
        const { project_id, particulars, uploaded_by, approved_by, remarks, status } = req.body;

        const [existing] = await pool.execute('SELECT * FROM Drawing WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Drawing not found'
            });
        }

        const updateFields = [];
        const updateValues = [];

        if (project_id !== undefined) { updateFields.push('project_id = ?'); updateValues.push(project_id); }
        if (particulars !== undefined) { updateFields.push('particulars = ?'); updateValues.push(particulars); }

        // If new file uploaded — store as base64 (demo) or S3 URL (production)
        if (req.file) {
            // PRODUCTION (S3): replace below with → updateValues.push(req.file.location);
            const base64 = req.file.buffer.toString('base64');
            const dataUrl = `data:${req.file.mimetype};base64,${base64}`;
            updateFields.push('file_url = ?');
            updateValues.push(dataUrl);
        }

        if (uploaded_by !== undefined) { updateFields.push('uploaded_by = ?'); updateValues.push(uploaded_by); }
        if (approved_by !== undefined) { updateFields.push('approved_by = ?'); updateValues.push(approved_by); }
        if (remarks !== undefined) { updateFields.push('remarks = ?'); updateValues.push(remarks); }
        if (status !== undefined) { updateFields.push('status = ?'); updateValues.push(status); }

        if (updateFields.length === 0) {
            return res.status(400).json({ success: false, message: 'No fields to update' });
        }

        updateValues.push(id);
        const query = `UPDATE Drawing SET ${updateFields.join(', ')} WHERE id = ?`;
        await pool.execute(query, updateValues);

        res.status(200).json({
            success: true,
            message: 'Drawing updated successfully',
            data: { id: parseInt(id) }
        });
    } catch (error) {
        console.error('Error updating drawing:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating drawing',
            error: error.message
        });
    }
};

module.exports = {
    createDrawing,
    getAllDrawings,
    updateDrawing,
    upload
};