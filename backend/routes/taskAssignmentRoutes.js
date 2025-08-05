const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/taskAssignmentController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// List all assignments
router.get('/', authenticateToken, ctrl.list);
// List assignments for a user
router.get('/user/:userId', authenticateToken, ctrl.list);
// Create batch assignments
router.post('/batch', authenticateToken, authorizeRoles('Manager', 'Admin', 'SuperAdmin'), ctrl.createBatch);
// Update status
router.put('/:id/status', authenticateToken, ctrl.updateStatus);
// Escalate
router.post('/:id/escalate', authenticateToken, ctrl.escalate);
// Reassign
router.put('/:id/reassign', authenticateToken, authorizeRoles('Manager', 'Admin', 'SuperAdmin'), ctrl.reassign);
// Get by batch
router.get('/batch/:batchId', authenticateToken, ctrl.getByBatch);

module.exports = router;
