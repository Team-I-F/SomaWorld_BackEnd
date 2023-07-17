const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db/database.js");

const saltRounds = 5;

router.post("/", async (req, res) => {
  const param = [req.body.id, req.body.pw, req.body.name, req.body.nickname];
  try {
    const hash = await bcrypt.hash(param[1], saltRounds);
    param[1] = hash;
    await db.query(
      "INSERT INTO User(`userId`,`userPassword`,`userName`,`userNickname`) VALUES (?,?,?,?)",
      param
    );
  } catch (e) {
    console.log(e);
    res.status(500).send("500 error");
  }
  res.status(200).send();
});

module.exports = router;
