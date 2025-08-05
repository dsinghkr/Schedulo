const multer = require('multer');
const xlsx = require('xlsx');
const db = require('../models');
const Category = db.Category;
const Task = db.Task;
const Customer = db.Customer;
const { Op } = require('sequelize');

// Multer setup for file upload
const upload = multer({ dest: 'uploads/' });

// Import Tasks from Excel
exports.importTasks = [
  upload.single('file'),
  async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);
    if (!rows.length) return res.status(400).json({ message: 'No data found in file' });
    // Check for year in Start Date
    const year = new Date(rows[0]['Start Date']).getFullYear();
    const existing = await Task.findOne({
      where: {
        startDate: { [Op.gte]: new Date(`${year}-01-01`), [Op.lte]: new Date(`${year}-12-31`) },
        deleted: false
      }
    });
    if (existing) return res.status(400).json({ message: `Tasks for year ${year} already exist. Cleanup and reimport or enter manually.` });
    // Bulk create tasks
    for (const row of rows) {
      // Find or create category
      let category = await Category.findOne({ where: { name: row['Category'], deleted: false } });
      if (!category) category = await Category.create({ name: row['Category'], description: '' });
      await Task.create({
        name: row['Task'],
        categoryId: category.id,
        startDate: new Date(row['Start Date']),
        dueDate: new Date(row['Due Date']),
        status: 'pending',
      });
    }
    res.json({ message: 'Tasks imported successfully' });
  }
];

// Import Customers from Excel
exports.importCustomers = [
  upload.single('file'),
  async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);
    if (!rows.length) return res.status(400).json({ message: 'No data found in file' });

    const requiredFields = ['Name', 'Address', 'Google Map Location', 'Contact Person Name', 'Phone Number', 'Alternate Number'];
    let successCount = 0;
    let skippedCount = 0;
    let errorRows = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      // Check for missing columns
      const missing = requiredFields.filter(f => !(f in row));
      if (missing.length) {
        errorRows.push({ row: i + 2, error: `Missing columns: ${missing.join(', ')}` });
        skippedCount++;
        continue;
      }
      // Conflict check
      try {
        const exists = await Customer.findOne({
          where: {
            [Op.or]: [
              { name: row['Name'] },
              { phoneNumber: row['Phone Number'] }
            ],
            deleted: false
          }
        });
        if (exists) {
          errorRows.push({ row: i + 2, error: 'Duplicate name or phone number' });
          skippedCount++;
          continue;
        }
        await Customer.create({
          name: row['Name'],
          address: row['Address'],
          googleMapLocation: row['Google Map Location'],
          contactPersonName: row['Contact Person Name'],
          phoneNumber: row['Phone Number'],
          alternateNumber: row['Alternate Number']
        });
        successCount++;
      } catch (err) {
        errorRows.push({ row: i + 2, error: err.message });
        skippedCount++;
      }
    }
    res.json({
      message: `Import complete. Success: ${successCount}, Skipped: ${skippedCount}`,
      errors: errorRows
    });
  }
];
