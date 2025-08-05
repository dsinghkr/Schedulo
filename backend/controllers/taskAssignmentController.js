const db = require('../models');
const TaskAssignment = db.TaskAssignment;
const Task = db.Task;
const User = db.User;
const Customer = db.Customer;
const Team = db.Team;
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

// List all assignments (optionally filter by user)
exports.list = async (req, res) => {
  const where = { deleted: false };
  if (req.params.userId) where.userId = req.params.userId;
  const assignments = await TaskAssignment.findAll({
    where,
    include: [
      { model: Task },
      { model: User },
      { model: Customer },
      { model: Team }
    ],
    order: [['createdAt', 'DESC']]
  });
  res.json(assignments);
};

// Create batch assignments
exports.createBatch = async (req, res) => {
  const { userId, taskId, customerIds, teamId } = req.body;
  if (!userId || !taskId || !customerIds || !Array.isArray(customerIds) || !teamId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const batchId = uuidv4();
  const assignments = await Promise.all(customerIds.map(async (customerId) => {
    return TaskAssignment.create({
      userId,
      taskId,
      customerId,
      teamId,
      batchId
    });
  }));
  res.status(201).json(assignments);
};

// Update status
exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  const assignment = await TaskAssignment.findByPk(req.params.id);
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
  assignment.status = status;
  await assignment.save();
  res.json(assignment);
};

// Escalate
exports.escalate = async (req, res) => {
  const assignment = await TaskAssignment.findByPk(req.params.id);
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
  assignment.escalated = true;
  await assignment.save();
  res.json(assignment);
};

// Reassign (change user or team)
exports.reassign = async (req, res) => {
  const { userId, teamId } = req.body;
  const assignment = await TaskAssignment.findByPk(req.params.id);
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
  if (userId) assignment.userId = userId;
  if (teamId) assignment.teamId = teamId;
  await assignment.save();
  res.json(assignment);
};

// Get by batch
exports.getByBatch = async (req, res) => {
  const { batchId } = req.params;
  const assignments = await TaskAssignment.findAll({
    where: { batchId, deleted: false },
    include: [Task, User, Customer, Team],
    order: [['createdAt', 'DESC']]
  });
  res.json(assignments);
};
