module.exports = (sequelize, DataTypes) => {
  const BoardInfo = sequelize.define(
    "BoardInfo",
    {
      tableInfoId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      tableName: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      tableName: "boardInfo",
      timestamps: false,
    }
  );
  return BoardInfo;
};
