const db = require('../models');
const User = db.User;
const bcrypt = require('bcryptjs');

// Get all users (excluding deleted)
exports.getAll = async (req, res) => {
  try {
    const users = await User.findAll({ where: { deleted: false } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch users.' });
  }
};

// Get user by id
exports.getById = async (req, res) => {
  const id = req.params.id;
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: 'Invalid user id.' });
  }
  const user = await User.findOne({ where: { id: Number(id), deleted: false } });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

// Create user
exports.create = async (req, res) => {
  try {
    let { name, email, password, phoneNumber, role, teamId } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ message: 'Name, email, and role are required.' });
    }
    // Hash password if provided
    let hash = null;
    if (password) {
      hash = await bcrypt.hash(password, 10);
    }
    // Sanitize teamId
    if (teamId === undefined || teamId === null || teamId === '' || teamId === 'undefined' || isNaN(Number(teamId))) {
      teamId = null;
    } else {
      teamId = Number(teamId);
    }
    // Asst-Manager constraint
    if (role === 'Asst-Manager' && teamId) {
      const existingLead = await User.findOne({ where: { teamId, role: 'Asst-Manager', deleted: false } });
      if (existingLead) {
        return res.status(400).json({ message: 'This team already has an assistant manager.' });
      }
    }
    const user = await User.create({ name, email, password: hash, phoneNumber, role, teamId });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to create user.' });
  }
};

// Update user
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: 'Invalid user id.' });
    }
    let { name, email, password, phoneNumber, role, teamId } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ message: 'Name, email, and role are required.' });
    }
    const user = await User.findOne({ where: { id: Number(id), deleted: false } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Asst-Manager constraint
    if (role === 'Asst-Manager' && teamId) {
      const existingLead = await User.findOne({ where: { teamId, role: 'Asst-Manager', deleted: false, id: { [db.Sequelize.Op.ne]: user.id } } });
      if (existingLead) {
        return res.status(400).json({ message: 'This team already has an assistant manager.' });
      }
    }
    // Only assign password if provided (let model hook hash it)
    let updateData = { name, email, phoneNumber, role, teamId };
    if (password) {
      updateData.password = password;
    }
    await user.update(updateData);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update user.' });
  }
};

// Soft delete user
exports.softDelete = async (req, res) => {
  const id = req.params.id;
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: 'Invalid user id.' });
  }
  const user = await User.findOne({ where: { id: Number(id), deleted: false } });
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.role === 'SuperAdmin') {
    return res.status(403).json({ message: 'SuperAdmin user cannot be deleted.' });
  }
  user.deleted = true;
  await user.save();
  res.json({ message: 'User soft deleted' });
};

// Assign user to a team (with role check)
exports.assignToTeam = async (req, res) => {
  try {
    const { userId, teamId, role } = req.body;
    if (!userId || isNaN(Number(userId))) {
      return res.status(400).json({ message: 'Invalid user id.' });
    }
    const user = await User.findOne({ where: { id: Number(userId), deleted: false } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (![ 'User', 'Asst-Manager', 'Manager' ].includes(role)) {
      return res.status(400).json({ message: 'Only users with role User, Manager, or Asst-Manager can be assigned to a team.' });
    }
    // If assigning as Manager, ensure no other Manager in the team
    if (role === 'Manager') {
      const existingManager = await User.findOne({ where: { teamId, role: 'Manager', deleted: false } });
      if (existingManager && existingManager.id !== user.id) {
        return res.status(400).json({ message: 'This team already has a manager.' });
      }
    }
    // If assigning as Asst-Manager, ensure no other Asst-Manager in the team
    if (role === 'Asst-Manager') {
      const existingLead = await User.findOne({ where: { teamId, role: 'Asst-Manager', deleted: false } });
      if (existingLead && existingLead.id !== user.id) {
        return res.status(400).json({ message: 'This team already has an assistant manager.' });
      }
    }
    user.teamId = teamId;
    user.role = role;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to assign user to team.' });
  }
};

// Dedicated endpoint for password reset
exports.resetPassword = async (req, res) => {
  try {
    const id = req.params.id;
    const { password } = req.body;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: 'Invalid user id.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }
    const user = await User.findOne({ where: { id: Number(id), deleted: false } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.password = password; // assign plain password, let model hook hash it
    await user.save();
    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to reset password.' });
  }
};
