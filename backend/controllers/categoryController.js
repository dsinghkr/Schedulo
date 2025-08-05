const db = require('../models');
const Category = db.Category;

exports.getAll = async (req, res) => {
  const categories = await Category.findAll({ where: { deleted: false } });
  res.json(categories);
};

exports.getById = async (req, res) => {
  const category = await Category.findOne({ where: { id: req.params.id, deleted: false } });
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json(category);
};

exports.create = async (req, res) => {
  const { name, description, year } = req.body;
  const category = await Category.create({ name, description, year });
  res.status(201).json(category);
};

exports.update = async (req, res) => {
  const { name, description, year } = req.body;
  const category = await Category.findOne({ where: { id: req.params.id, deleted: false } });
  if (!category) return res.status(404).json({ message: 'Category not found' });
  category.name = name;
  category.description = description;
  category.year = year;
  await category.save();
  res.json(category);
};

exports.softDelete = async (req, res) => {
  const category = await Category.findOne({ where: { id: req.params.id, deleted: false } });
  if (!category) return res.status(404).json({ message: 'Category not found' });
  category.deleted = true;
  await category.save();
  res.json({ message: 'Category soft deleted' });
};
