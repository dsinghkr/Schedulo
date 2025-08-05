module.exports = (sequelize, DataTypes) => {
  const TaskAttachment = sequelize.define('TaskAttachment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    taskId: { type: DataTypes.INTEGER, allowNull: false },
    filename: { type: DataTypes.STRING, allowNull: false },
    originalName: { type: DataTypes.STRING, allowNull: false },
    mimetype: { type: DataTypes.STRING },
    size: { type: DataTypes.INTEGER },
    uploadedBy: { type: DataTypes.INTEGER },
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    defaultScope: {
      where: { deleted: false }
    },
    timestamps: true
  });
  return TaskAttachment;
};
