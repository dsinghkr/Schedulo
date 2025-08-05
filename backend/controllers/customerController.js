const db = require('../models');
const Customer = db.Customer;

exports.getAll = async (req, res) => {
  const customers = await Customer.findAll({ where: { deleted: false } });
  res.json(customers);
};

exports.getById = async (req, res) => {
  const customer = await Customer.findOne({ where: { id: req.params.id, deleted: false } });
  if (!customer) return res.status(404).json({ message: 'Customer not found' });
  res.json(customer);
};

exports.create = async (req, res) => {
  const { name, address, googleMapLocation, contactPersonName, phoneNumber, alternateNumber } = req.body;
  const customer = await Customer.create({ name, address, googleMapLocation, contactPersonName, phoneNumber, alternateNumber });
  res.status(201).json(customer);
};

exports.update = async (req, res) => {
  const { name, address, googleMapLocation, contactPersonName, phoneNumber, alternateNumber } = req.body;
  const customer = await Customer.findOne({ where: { id: req.params.id, deleted: false } });
  if (!customer) return res.status(404).json({ message: 'Customer not found' });
  Object.assign(customer, { name, address, googleMapLocation, contactPersonName, phoneNumber, alternateNumber });
  await customer.save();
  res.json(customer);
};

exports.softDelete = async (req, res) => {
  const customer = await Customer.findOne({ where: { id: req.params.id, deleted: false } });
  if (!customer) return res.status(404).json({ message: 'Customer not found' });
  customer.deleted = true;
  await customer.save();
  res.json({ message: 'Customer soft deleted' });
};
