const db = require('../models');
const TaskHistory = db.TaskHistory;

exports.getAll = async (req, res) => {
  const histories = await TaskHistory.findAll({ where: { deleted: false } });
  res.json(histories);
};

exports.getById = async (req, res) => {
  const history = await TaskHistory.findOne({ where: { id: req.params.id, deleted: false } });
  if (!history) return res.status(404).json({ message: 'TaskHistory not found' });
  res.json(history);
};

exports.create = async (req, res) => {
  const { taskId, action, details, performedBy } = req.body;
  const taskHistory = await TaskHistory.create({ taskId, action, details, performedBy });
  res.status(201).json(taskHistory);
};

exports.update = async (req, res) => {
  const { action, details, performedBy } = req.body;
  const taskHistory = await TaskHistory.findOne({ where: { id: req.params.id, deleted: false } });
  if (!taskHistory) return res.status(404).json({ message: 'TaskHistory not found' });
  Object.assign(taskHistory, { action, details, performedBy });
  await taskHistory.save();
  res.json(taskHistory);
};

exports.softDelete = async (req, res) => {
  const taskHistory = await TaskHistory.findOne({ where: { id: req.params.id, deleted: false } });
  if (!taskHistory) return res.status(404).json({ message: 'TaskHistory not found' });
  taskHistory.deleted = true;
  await taskHistory.save();
  res.json({ message: 'TaskHistory soft deleted' });
};
