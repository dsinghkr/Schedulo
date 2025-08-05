const db = require('../models');
const Team = db.Team;
const User = db.User;

exports.getAll = async (req, res) => {
  try {
    const teams = await Team.findAll({ where: { deleted: false } });
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch teams.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const team = await Team.findOne({ where: { id: req.params.id, deleted: false } });
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch team.' });
  }
};

exports.getUsersByTeam = async (req, res) => {
  try {
    let teamId = req.params.id;
    console.log('getUsersByTeam called with teamId:', teamId); // Debug log
    // Only use teamId if it's a valid integer
    if (teamId === undefined || teamId === null || teamId === '' || isNaN(Number(teamId))) {
      return res.status(400).json({ message: 'Invalid team ID.' });
    }
    teamId = Number(teamId);
    const users = await User.findAll({ where: { teamId, deleted: false } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch users for team.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Team name is required.' });
    }
    const team = await Team.create({ name, description });
    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to create team.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Team name is required.' });
    }
    const team = await Team.findOne({ where: { id: req.params.id, deleted: false } });
    if (!team) return res.status(404).json({ message: 'Team not found' });
    team.name = name;
    team.description = description;
    await team.save();
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update team.' });
  }
};

exports.softDelete = async (req, res) => {
  try {
    const team = await Team.findOne({ where: { id: req.params.id, deleted: false } });
    if (!team) return res.status(404).json({ message: 'Team not found' });
    team.deleted = true;
    await team.save();
    res.json({ message: 'Team soft deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to delete team.' });
  }
};
