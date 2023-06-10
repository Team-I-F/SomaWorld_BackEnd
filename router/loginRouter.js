const express = require("express");
const router = express.Router();
const util = require("util");
const bcrypt = require("bcrypt");
const compareAsync = util.promisify(bcrypt.compare);
const db = require("../db/database.js");

const saltRounds = 5;

router.post("/login", async (req, res) => {
  try {
    const param = [req.body.id, req.body.pw];
    const row = await db.query("SELECT * FROM User WHERE userId=?", [param[0]]);
    if (row.length > 0) {
      let values = Object.values(row[0], [1], [2], [3]);
      values = JSON.stringify(values).replace(/^\[|\]$/g, "");
      values = JSON.parse(values);
      const result = await compareAsync(param[1], values.userPassword);

      if (result) {
        req.session.loginData = {
          userName: values.userName,
          userNickname: values.userNickname,
        };
        req.session.save;
        res.json({ message: "success" });
      } else {
        console.log("fail");
      }
    } else {
      console.log("ID가 존재하지 않습니다");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }

  res.end();
});

router.get("/logout", async (req, res) => {
  try {
    if (req.session.loginData) {
      req.session.loginData = null;
      res.json({ message: "success" });
    } else {
      res.json({ message: "fail" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.get("/loginCheck", async (req, res) => {
  try {
    if (req.session.loginData != null) {
      res.send({ loggedIn: true, loginData: req.session.loginData });
    } else {
      res.send({ loggedIn: false });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

module.exports = router;
