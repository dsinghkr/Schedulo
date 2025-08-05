const db = require('../models');
const User = db.User;
const Team = db.Team;

exports.getAll = async (req, res) => {
  const users = await User.findAll({ where: { deleted: false } });
  res.json(users);
};

exports.getById = async (req, res) => {
  const user = await User.findOne({ where: { id: req.params.id, deleted: false } });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

exports.create = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, role, teamId } = req.body;
    console.log('CREATE USER: Received teamId:', teamId, typeof teamId);
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required.' });
    }
    // If assigning as Asst-Manager, ensure no other Asst-Manager in the team
    if (role === 'Asst-Manager' && teamId && !isNaN(Number(teamId))) {
      const existingLead = await User.findOne({ where: { teamId: Number(teamId), role: 'Asst-Manager', deleted: false } });
      if (existingLead) {
        return res.status(400).json({ message: 'This team already has an assistant manager.' });
      }
    }
    const userData = { name, email, password, phoneNumber, role };
    // Only set teamId if it's a valid integer
    if (teamId !== undefined && teamId !== null && teamId !== '' && !isNaN(Number(teamId))) {
      userData.teamId = Number(teamId);
    }
    const user = await User.create(userData);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to create user.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, role, teamId } = req.body;
    console.log('UPDATE USER: Received teamId:', teamId, typeof teamId);
    if (!name || !email || !role) {
      return res.status(400).json({ message: 'Name, email, and role are required.' });
    }
    const user = await User.findOne({ where: { id: req.params.id, deleted: false } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    // If changing to Asst-Manager, ensure no other Asst-Manager in the team
    if (role === 'Asst-Manager' && teamId && !isNaN(Number(teamId))) {
      const existingLead = await User.findOne({ where: { teamId: Number(teamId), role: 'Asst-Manager', deleted: false, id: { [db.Sequelize.Op.ne]: user.id } } });
      if (existingLead) {
        return res.status(400).json({ message: 'This team already has an assistant manager.' });
      }
    }
    const userData = { name, email, password, phoneNumber, role };
    // Only set teamId if it's a valid integer
    if (teamId !== undefined && teamId !== null && teamId !== '' && !isNaN(Number(teamId))) {
      userData.teamId = Number(teamId);
    }
    Object.assign(user, userData);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update user.' });
  }
};

exports.softDelete = async (req, res) => {
  const user = await User.findOne({ where: { id: req.params.id, deleted: false } });
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
  const { userId, teamId, role } = req.body;
  const user = await User.findOne({ where: { id: userId, deleted: false } });
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
};
