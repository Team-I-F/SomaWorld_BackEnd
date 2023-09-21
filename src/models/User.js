module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      userUniqueId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        default: 1,
      },
      userId: {
        type: DataTypes.STRING(30),
        primaryKey: true,
        allowNull: false,
      },
      userPassword: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      userName: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      userNickname: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "user",
      timestamps: false,
    }
  );

  return User;
};
