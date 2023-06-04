const express = require("express");
const app = express();
const br = require("./router/boardRouter.js");
const mr = require("./router/memberRouter.js");
const lr = require("./router/loginRouter.js");
const mid = require("./middleware/index.js");
const co = require("./router/commentRouter.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mid);

app.use("/board", br); // 게시판
app.use("/register", mr); // 회원가입
app.use("/user", lr); // 로그인
app.use("/comment", co);

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
