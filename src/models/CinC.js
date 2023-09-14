module.exports = (sequelize, DataTypes) => {
  const CinC = sequelize.define(
    "CinC",
    {
      commentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: false,
      },
      cincId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userNickname: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      comment: {
        type: DataTypes.STRING(2000),
        allowNull: true,
      },
      created: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
    },
    {
      tableName: "CinC", // 테이블 이름을 "CinC"로 설정
      timestamps: false, // createdAt, updatedAt 컬럼을 사용하지 않음
    }
  );

  return CinC;
};
