const db = require('../models');
const Task = db.Task;
const User = db.User;
const Team = db.Team;
const Category = db.Category;
const Customer = db.Customer;
const { Op } = require('sequelize');
const xlsx = require('xlsx');
const PDFDocument = require('pdfkit');

// Work in progress items team-wise
exports.teamWorkInProgress = async (req, res) => {
  const teams = await Team.findAll({
    include: [{
      model: User,
      include: [{
        model: Task,
        where: { status: { [Op.not]: 'sealed' }, deleted: false },
        required: false
      }],
      required: false
    }],
    where: { deleted: false }
  });
  res.json(teams);
};

// Export tasks as Excel
exports.exportTasksExcel = async (req, res) => {
  const tasks = await Task.findAll({ include: [Category, Customer], where: { deleted: false } });
  const data = tasks.map(t => ({
    Task: t.name,
    Category: t.Category ? t.Category.name : '',
    Customer: t.Customer ? t.Customer.name : '',
    Status: t.status,
    StartDate: t.startDate,
    DueDate: t.dueDate
  }));
  const ws = xlsx.utils.json_to_sheet(data);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'Tasks');
  const buf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Content-Disposition', 'attachment; filename="tasks.xlsx"');
  res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buf);
};

// Export tasks as PDF
exports.exportTasksPDF = async (req, res) => {
  const tasks = await Task.findAll({ include: [Category, Customer], where: { deleted: false } });
  const doc = new PDFDocument();
  res.setHeader('Content-Disposition', 'attachment; filename="tasks.pdf"');
  res.type('application/pdf');
  doc.pipe(res);
  doc.fontSize(16).text('Tasks Report', { align: 'center' });
  doc.moveDown();
  tasks.forEach(t => {
    doc.fontSize(12).text(`Task: ${t.name}`);
    doc.text(`Category: ${t.Category ? t.Category.name : ''}`);
    doc.text(`Customer: ${t.Customer ? t.Customer.name : ''}`);
    doc.text(`Status: ${t.status}`);
    doc.text(`Start Date: ${t.startDate}`);
    doc.text(`Due Date: ${t.dueDate}`);
    doc.moveDown();
  });
  doc.end();
};
