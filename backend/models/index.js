const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
  'schedulo', // Database name
  'postgres', // Username
  'postgres', // Password
  {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
    port: 5432 // Default PostgreSQL port
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Category = require('./Category')(sequelize, DataTypes);
db.Task = require('./Task')(sequelize, DataTypes);
db.Customer = require('./Customer')(sequelize, DataTypes);
db.User = require('./User')(sequelize, DataTypes);
db.Team = require('./Team')(sequelize, DataTypes);
db.TaskStatus = require('./TaskStatus')(sequelize, DataTypes);
db.TaskHistory = require('./TaskHistory')(sequelize, DataTypes);
db.TaskAttachment = require('./TaskAttachment')(sequelize, DataTypes);
try { db.TaskComment = require('./TaskComment')(sequelize, DataTypes); } catch {}
try { db.TaskAssignment = require('./TaskAssignment')(sequelize, DataTypes); } catch {}

// Associations
// Category-Task
 db.Category.hasMany(db.Task, { foreignKey: 'categoryId' });
 db.Task.belongsTo(db.Category, { foreignKey: 'categoryId' });
// Team-User
 db.Team.hasMany(db.User, { foreignKey: 'teamId' });
 db.User.belongsTo(db.Team, { foreignKey: 'teamId' });
// Task-TaskStatus
 db.Task.hasMany(db.TaskStatus, { foreignKey: 'taskId' });
 db.TaskStatus.belongsTo(db.Task, { foreignKey: 'taskId' });
// Task-TaskHistory
 db.Task.hasMany(db.TaskHistory, { foreignKey: 'taskId' });
 db.TaskHistory.belongsTo(db.Task, { foreignKey: 'taskId' });
// User-Task (assignment)
 db.User.hasMany(db.Task, { foreignKey: 'assignedUserId' });
 db.Task.belongsTo(db.User, { foreignKey: 'assignedUserId' });
// Task-TaskAttachment
 db.Task.hasMany(db.TaskAttachment, { foreignKey: 'taskId' });
 db.TaskAttachment.belongsTo(db.Task, { foreignKey: 'taskId' });
// Task-TaskComment
if (db.TaskComment) {
  db.Task.hasMany(db.TaskComment, { foreignKey: 'taskId' });
  db.TaskComment.belongsTo(db.Task, { foreignKey: 'taskId' });
  db.User.hasMany(db.TaskComment, { foreignKey: 'userId' });
  db.TaskComment.belongsTo(db.User, { foreignKey: 'userId' });
}
// TaskAssignment (batch)
if (db.TaskAssignment) {
  db.TaskAssignment.belongsTo(db.Task, { foreignKey: 'taskId' });
  db.TaskAssignment.belongsTo(db.User, { foreignKey: 'userId' });
  db.TaskAssignment.belongsTo(db.Customer, { foreignKey: 'customerId' });
  db.TaskAssignment.belongsTo(db.Team, { foreignKey: 'teamId' });
}

module.exports = db;
