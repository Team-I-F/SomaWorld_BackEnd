require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models");
const {
  NotFoundException,
  UnAuthorizedException,
  InternalServerException,
  BadRequestException,
} = require("../global/exception/Exceptions");
const env = process.env;
const saltRounds = 10;

router.post("/", async (req, res, next) => {
  const { id, pw, name, nickname } = req.body;
  const { result } = await User.findAll({
    attributes: ["userId"],
  });
  console.log(result);
  if (!id || !pw || !name || !nickname) {
    return next(new BadRequestException());
  }

  try {
    const hash = await bcrypt.hash(pw, saltRounds);
    await User.create({
      userId: id,
      userPassword: hash,
      userName: name,
      userNickname: nickname,
    });
    res.status(200).send({ success: true });
  } catch (e) {
    console.error(e);
    return next(new InternalServerException());
  }
});

module.exports = router;
