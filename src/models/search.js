module.exports = (sequelize, DataTypes) => {
  const search = sequelize.define(
    "Search",
    {
      word: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      count: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
    },
    {
      tableName: "search",
      timestamps: false,
    }
  );
  return search;
};
