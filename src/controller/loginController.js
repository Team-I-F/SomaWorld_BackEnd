require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models");
const {
  NotFoundException,
  UnAuthorizedException,
  InternalServerException,
} = require("../global/exception/Exceptions");

const env = process.env;

const saltRounds = 10;

router.post("/login", async (req, res, next) => {
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
        console.log(req.session.loginData);
        res.json({ message: "success" });
      } else {
        return next(new UnAuthorizedException());
      }
    } else {
      return next(new NotFoundException());
    }
  } catch (e) {
    console.error(e);
    return next(new InternalServerException());
  }
});

router.get("/logout", (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return next(new NotFoundException());
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
