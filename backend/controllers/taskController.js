const db = require('../models');
const Task = db.Task;
const TaskStatus = db.TaskStatus;
const TaskHistory = db.TaskHistory;
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

exports.getAll = async (req, res) => {
  const tasks = await Task.findAll({ where: { deleted: false } });
  res.json(tasks);
};

exports.getById = async (req, res) => {
  const task = await Task.findOne({ where: { id: req.params.id, deleted: false } });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
};

exports.create = async (req, res) => {
  const { name, categoryId, assignedUserId, startDate, dueDate, status } = req.body;
  if (!name || !categoryId || !startDate || !dueDate) {
    return res.status(400).json({ message: 'Name, category, start date, and due date are required.' });
  }
  const task = await Task.create({ name, categoryId, assignedUserId, startDate, dueDate, status });
  res.status(201).json(task);
};

exports.update = async (req, res) => {
  const { name, categoryId, assignedUserId, startDate, dueDate, status } = req.body;
  if (!name || !categoryId || !startDate || !dueDate) {
    return res.status(400).json({ message: 'Name, category, start date, and due date are required.' });
  }
  const task = await Task.findOne({ where: { id: req.params.id, deleted: false } });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  Object.assign(task, { name, categoryId, assignedUserId, startDate, dueDate, status });
  await task.save();
  res.json(task);
};

exports.softDelete = async (req, res) => {
  const task = await Task.findOne({ where: { id: req.params.id, deleted: false } });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  task.deleted = true;
  await task.save();
  res.json({ message: 'Task soft deleted' });
};

exports.transitionStatus = async (req, res) => {
  const { id } = req.params;
  const { newStatus, comment } = req.body;
  const userId = req.user.id;
  const allowedTransitions = {
    pending: ['completed', 'rejected'],
    completed: ['sealed', 'rejected'],
    rejected: ['pending'],
    sealed: []
  };
  const task = await Task.findOne({ where: { id, deleted: false } });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  if (task.status === 'sealed') return res.status(400).json({ message: 'Task is sealed and cannot be changed' });
  if (!allowedTransitions[task.status] || !allowedTransitions[task.status].includes(newStatus)) {
    return res.status(400).json({ message: `Invalid status transition from ${task.status} to ${newStatus}` });
  }
  // Update status
  task.status = newStatus;
  await task.save();
  // Add TaskStatus record
  await TaskStatus.create({ taskId: id, status: newStatus, comment, updatedBy: userId });
  // Add TaskHistory record
  await TaskHistory.create({ taskId: id, action: `status_changed`, details: `Status changed to ${newStatus}. ${comment || ''}`.trim(), performedBy: userId });
  res.json({ message: `Task status updated to ${newStatus}` });
};
