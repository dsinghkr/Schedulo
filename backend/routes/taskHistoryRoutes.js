const express = require('express');
const router = express.Router();
const taskHistoryController = require('../controllers/taskHistoryController');

router.get('/', taskHistoryController.getAll);
router.get('/:id', taskHistoryController.getById);
router.post('/', taskHistoryController.create);
router.put('/:id', taskHistoryController.update);
router.delete('/:id', taskHistoryController.softDelete);

module.exports = router;
