const Sequelize = require("sequelize");
const config = require("../config")[process.env.NODE_ENV || "development"];
const db = {};
// 아래 설정을 통해 Sequelize가 노드와 MySQL을 연결해줍니다.
// 연결에 성공하면 sequelize 객체에 연결정보가 담기게 됩니다.
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// 만들어논 모델들을 불러와 Sequelize에 연결해줍니다.
db.Board = require("./board")(sequelize, Sequelize);
db.Gallery = require("./Gallery")(sequelize, Sequelize);
db.User = require("./User")(sequelize, Sequelize);
db.Comment = require("./comment")(sequelize, Sequelize);
db.CinC = require("./CinC")(sequelize, Sequelize);

// 각 모델들의 associate 함수를 호출하여 관계를 설정합니다.
Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
