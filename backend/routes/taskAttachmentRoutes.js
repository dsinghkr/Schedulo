const express = require('express');
const router = express.Router();
const taskAttachmentController = require('../controllers/taskAttachmentController');
const { authenticateToken } = require('../middleware/auth');

// Upload attachment to a task
router.post('/:id/upload', authenticateToken, taskAttachmentController.uploadAttachment);

module.exports = router;
