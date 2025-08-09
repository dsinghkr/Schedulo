module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: true }, // Make password optional
    phoneNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    role: { type: DataTypes.ENUM('SuperAdmin', 'Admin', 'Manager', 'Asst-Manager', 'User'), allowNull: false },
    teamId: { type: DataTypes.INTEGER, allowNull: true },
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    defaultScope: {
      where: { deleted: false }
    },
    timestamps: true,
    hooks: {
      beforeUpdate: async (user, options) => {
        if (user.changed('password') && user.password) {
          const bcrypt = require('bcryptjs');
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });
  return User;
};
