const db = require('../models');
const User = db.User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'schedulo_secret';

exports.register = async (req, res) => {
  let { name, email, password, phoneNumber, role, teamId } = req.body;
  // Sanitize teamId: treat 'undefined', undefined, null, '' as null
  if (teamId === undefined || teamId === null || teamId === '' || teamId === 'undefined' || isNaN(Number(teamId))) {
    teamId = null;
  }
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) return res.status(400).json({ message: 'Email already in use' });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash, phoneNumber, role, teamId });
  res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email, deleted: false } });
  console.log('Login attempt for email:', email);
  if (!user) {
    console.log('No user found for email:', email);
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  console.log('User found:', user.email, 'Hashed password:', user.password);
  const valid = await bcrypt.compare(password, user.password);
  console.log('Password valid?', valid);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
};
