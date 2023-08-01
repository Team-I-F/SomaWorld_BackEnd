module.exports = (sequelize, DataTypes) => {
  const Board = sequelize.define(
    "Board",
    {
      tableInfoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tableId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        default: 1,
      },
      title: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      userNickname: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING(2000),
        allowNull: true,
      },
      created: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      views: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "board",
      timestamps: false,
    }
  );
  return Board;
};
