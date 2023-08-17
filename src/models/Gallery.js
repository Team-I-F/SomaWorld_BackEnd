module.exports = (sequelize, DataTypes) => {
  const Gallery = sequelize.define(
    "Gallery",
    {
      galleryId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      galleryName: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      tableName: "gallery",
      timestamps: false,
    }
  );
  return Gallery;
};
