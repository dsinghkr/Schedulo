const express = require('express');
const router = express.Router();
const importController = require('../controllers/importController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Only allow Admins and above to import
router.post('/tasks', authenticateToken, authorizeRoles('SuperAdmin', 'Admin'), importController.importTasks);
router.post('/customers', authenticateToken, authorizeRoles('SuperAdmin', 'Admin'), importController.importCustomers);

module.exports = router;
