module.exports = (sequelize, DataTypes) => {
  const TaskHistory = sequelize.define('TaskHistory', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    taskId: { type: DataTypes.INTEGER, allowNull: false },
    action: { type: DataTypes.STRING, allowNull: false }, // e.g., created, updated, assigned, completed, rejected, sealed
    details: { type: DataTypes.STRING },
    performedBy: { type: DataTypes.INTEGER }, // User ID
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    defaultScope: {
      where: { deleted: false }
    },
    timestamps: true
  });
  return TaskHistory;
};
