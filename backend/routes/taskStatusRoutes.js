const express = require('express');
const router = express.Router();
const taskStatusController = require('../controllers/taskStatusController');

router.get('/', taskStatusController.getAll);
router.get('/:id', taskStatusController.getById);
router.post('/', taskStatusController.create);
router.put('/:id', taskStatusController.update);
router.delete('/:id', taskStatusController.softDelete);

module.exports = router;
