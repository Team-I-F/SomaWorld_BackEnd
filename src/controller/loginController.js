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

router.post("/login", async (req, res, next) => {
  try {
    const { id, pw } = req.body;
    const userData = await User.findOne({ where: { userId: id } });

    if (userData) {
      const result = await bcrypt.compare(pw, userData.userPassword);

      if (result) {
        req.session.loginData = {
          userId: id,
          userName: userData.userName,
          userNickname: userData.userNickname,
          admin: userData.admin,
        };
        req.session.save();
        console.log(req.session.loginData);
        res.status(200).send();
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

router.get("/logout", (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return next(new NotFoundException());
      } else {
        res.status(200).send();
      }
    });
  } catch (e) {
    console.error(e);
    return next(new InternalServerException());
  }
});

router.get("/loginCheck", (req, res, next) => {
  try {
    if (req.session.loginData) {
      res.send({ loggedIn: true, loginData: req.session.loginData });
    } else {
      res.send({ loggedIn: false });
    }
  } catch (e) {
    console.error(e);
    return next(new InternalServerException());
  }
});

module.exports = router;
