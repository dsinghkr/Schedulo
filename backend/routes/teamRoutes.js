const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

router.get('/', teamController.getAll);
router.get('/:id', teamController.getById);
router.get('/:id/users', teamController.getUsersByTeam); // <-- Added
router.post('/', teamController.create);
router.put('/:id', teamController.update);
router.delete('/:id', teamController.softDelete);

module.exports = router;
