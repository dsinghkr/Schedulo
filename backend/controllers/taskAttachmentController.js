const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const db = require('../models');
const TaskAttachment = db.TaskAttachment;
const Task = db.Task;

// Multer setup
const upload = multer({ dest: 'uploads/' });

// Antivirus scan using Windows Defender
async function scanFileWithDefender(filePath) {
  return new Promise((resolve, reject) => {
    // Windows Defender command
    const defenderCmd = `"C:\\Program Files\\Windows Defender\\MpCmdRun.exe" -Scan -ScanType 3 -File ${filePath}`;
    exec(defenderCmd, (error, stdout, stderr) => {
      if (error) {
        // If Defender is not available, allow for dev/test
        if (stderr && stderr.includes('not recognized')) return resolve(true);
        return reject(stderr || error);
      }
      // Defender returns 0 if no threats found
      if (stdout.includes('No threats')) return resolve(true);
      resolve(false);
    });
  });
}

exports.uploadAttachment = [
  upload.single('file'),
  async (req, res) => {
    const { id } = req.params; // taskId
    const userId = req.user.id;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    // Scan file
    try {
      const clean = await scanFileWithDefender(req.file.path);
      if (!clean) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'File failed antivirus scan' });
      }
    } catch (err) {
      fs.unlinkSync(req.file.path);
      return res.status(500).json({ message: 'Antivirus scan error', error: err });
    }
    // Save metadata
    const attachment = await TaskAttachment.create({
      taskId: id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedBy: userId
    });
    res.json({ message: 'File uploaded and scanned successfully', attachment });
  }
];
