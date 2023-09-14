module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      commentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tableId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      tableName: "comment", // 테이블 이름을 "comment"로 설정
      timestamps: false, // createdAt, updatedAt 컬럼을 사용하지 않음
    }
  );

  return Comment;
};
