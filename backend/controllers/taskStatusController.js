const db = require('../models');
const TaskStatus = db.TaskStatus;

exports.getAll = async (req, res) => {
  const statuses = await TaskStatus.findAll({ where: { deleted: false } });
  res.json(statuses);
};

exports.getById = async (req, res) => {
  const status = await TaskStatus.findOne({ where: { id: req.params.id, deleted: false } });
  if (!status) return res.status(404).json({ message: 'TaskStatus not found' });
  res.json(status);
};

exports.create = async (req, res) => {
  const { taskId, status, comment, updatedBy } = req.body;
  const taskStatus = await TaskStatus.create({ taskId, status, comment, updatedBy });
  res.status(201).json(taskStatus);
};

exports.update = async (req, res) => {
  const { status, comment, updatedBy } = req.body;
  const taskStatus = await TaskStatus.findOne({ where: { id: req.params.id, deleted: false } });
  if (!taskStatus) return res.status(404).json({ message: 'TaskStatus not found' });
  Object.assign(taskStatus, { status, comment, updatedBy });
  await taskStatus.save();
  res.json(taskStatus);
};

exports.softDelete = async (req, res) => {
  const taskStatus = await TaskStatus.findOne({ where: { id: req.params.id, deleted: false } });
  if (!taskStatus) return res.status(404).json({ message: 'TaskStatus not found' });
  taskStatus.deleted = true;
  await taskStatus.save();
  res.json({ message: 'TaskStatus soft deleted' });
};
