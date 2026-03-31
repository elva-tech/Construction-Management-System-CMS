const express = require('express');
const router = express.Router();
const drawingController = require('../controllers/drawing.controller');

// Create a new drawing (with file upload)
router.post('/create', drawingController.upload.single('drawing_file'), drawingController.createDrawing);

// Get all drawings
router.get('/all', drawingController.getAllDrawings);

// Update a drawing by ID (with optional file upload)
router.put('/update/:id', drawingController.upload.single('drawing_file'), drawingController.updateDrawing);

module.exports = router;