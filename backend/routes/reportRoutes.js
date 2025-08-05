const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Dashboard endpoints
router.get('/team-work-in-progress', authenticateToken, reportController.teamWorkInProgress);

// Export endpoints
router.get('/export-tasks-excel', authenticateToken, reportController.exportTasksExcel);
router.get('/export-tasks-pdf', authenticateToken, reportController.exportTasksPDF);

module.exports = router;
