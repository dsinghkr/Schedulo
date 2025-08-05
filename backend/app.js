// Schedulo backend starting...
// Express server setup with Sequelize
const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./models');
const bcrypt = require('bcryptjs');

const categoryRoutes = require('./routes/categoryRoutes');
const taskRoutes = require('./routes/taskRoutes');
const customerRoutes = require('./routes/customerRoutes');
const userRoutes = require('./routes/userRoutes');
const teamRoutes = require('./routes/teamRoutes');
const taskStatusRoutes = require('./routes/taskStatusRoutes');
const taskHistoryRoutes = require('./routes/taskHistoryRoutes');
const authRoutes = require('./routes/authRoutes');
const importRoutes = require('./routes/importRoutes');
const taskAttachmentRoutes = require('./routes/taskAttachmentRoutes');
const reportRoutes = require('./routes/reportRoutes');
const taskAssignmentRoutes = require('./routes/taskAssignmentRoutes');
const taskCommentRoutes = require('./routes/taskCommentRoutes');

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Schedulo API is running');
});

// Test log route
app.get('/api/test-log', (req, res) => {
  console.log('Test log route hit!');
  res.json({ message: 'Test log route hit!' });
});

app.use('/api/categories', categoryRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/task-statuses', taskStatusRoutes);
app.use('/api/task-histories', taskHistoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/import', importRoutes);
app.use('/api/task-attachments', taskAttachmentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/task-assignments', taskAssignmentRoutes);
app.use('/api/task-comments', taskCommentRoutes);

// Sync DB and start server
const PORT = process.env.PORT || 5000;
db.sequelize.sync({ alter: true }).then(async () => {
  // Seed SuperAdmin user if not exists
  const [user, created] = await db.User.findOrCreate({
    where: { email: 'admin@example.com' },
    defaults: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: await bcrypt.hash('password123', 10),
      phoneNumber: '1234567890',
      role: 'SuperAdmin'
    }
  });
  console.log('Seeded SuperAdmin user:', {
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    password: created ? 'password123' : '********' // Show password only if user was created
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
