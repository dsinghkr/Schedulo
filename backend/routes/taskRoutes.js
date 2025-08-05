const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', taskController.getAll);
router.get('/:id', taskController.getById);
router.post('/', taskController.create);
router.put('/:id', taskController.update);
router.delete('/:id', taskController.softDelete);

// Workflow status transition endpoint
router.post('/:id/transition', authenticateToken, taskController.transitionStatus);

module.exports = router;
