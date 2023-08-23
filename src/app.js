const express = require("express");
const app = express();
const port = 3000;
const db = require("./models");
const br = require("./controller/boardController");
const mr = require("./controller/memberController");
const lr = require("./controller/loginController");
const mid = require("./middleware/index.js");
const co = require("./controller/commentController");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mid);

app.use("/board", br); // 게시판
app.use("/register", mr); // 회원가입
app.use("/user", lr); // 로그인
app.use("/comment", co); // 댓글

db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공 ");
  })
  .catch(console.error);
app.listen(port, () => {
  console.log(`listening  at http://localhost:${port}`);
});
