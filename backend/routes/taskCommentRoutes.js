const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/taskCommentController');
const { authenticateToken } = require('../middleware/auth');

// List comments for a task
router.get('/:taskId', authenticateToken, ctrl.list);
// Add comment
router.post('/:taskId', authenticateToken, ctrl.add);
// Delete comment
router.delete('/:id', authenticateToken, ctrl.remove);

module.exports = router;
