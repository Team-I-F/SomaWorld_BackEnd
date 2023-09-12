require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models");

const env = process.env;
const saltRounds = 10;

router.post("/", async (req, res) => {
  const { id, pw, name, nickname } = req.body;

  if (!id || !pw || !name || !nickname) {
    return res.status(400).json({ error: "모든 필드를 입력해주세요." });
  }

  try {
    const hash = await bcrypt.hash(pw, saltRounds);
    await User.create({
      userId: id,
      userPassword: hash,
      userName: name,
      userNickname: nickname,
    });
    res.status(200).send({ message: "회원 가입이 완료되었습니다." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "회원 가입에 실패하였습니다." });
  }
});

module.exports = router;
