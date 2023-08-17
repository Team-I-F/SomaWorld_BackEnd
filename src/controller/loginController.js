const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models");
require("dotenv").config();

const env = process.env;

const saltRounds = env.ROUNDS;

router.post("/login", async (req, res) => {
  try {
    const { id, pw } = req.body;
    const userData = await User.findOne({ where: { userId: id } });

    if (userData) {
      const result = await bcrypt.compare(pw, userData.userPassword);

      if (result) {
        req.session.loginData = {
          userName: userData.userName,
          userNickname: userData.userNickname,
        };
        req.session.save();
        res.json({ message: "success" });
      } else {
        res.status(401).json({ message: "올바르지 않은 비밀번호" });
      }
    } else {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
});

router.get("/logout", (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        res.status(500).send();
      } else {
        res.json({ message: "success" });
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
});

router.get("/loginCheck", (req, res) => {
  try {
    if (req.session.loginData) {
      res.send({ loggedIn: true, loginData: req.session.loginData });
    } else {
      res.send({ loggedIn: false });
    }
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
});

module.exports = router;
