const express = require('express');
const router = express.Router();
const clientController = require('../controllers/Client.controller');

// Get all clients
router.get('/all', clientController.getAllClients);

// Create a new client
router.post('/create', clientController.createClient);

// Update a client by ID
router.put('/update/:id', clientController.updateClient);

module.exports = router;