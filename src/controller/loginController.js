const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models");
const {
  NotFoundException,
  UnAuthorizedException,
  InternalServerException,
} = require("../global/exception/Exceptions");

router.post("/login", async (req, res, next) => {
  try {
    const { id, pw } = req.body;
    const userData = await User.findOne({ where: { userId: id } });
    if (userData) {
      const result = await bcrypt.compare(pw, userData.userPassword);
      delete userData.dataValues.userPassword;

      if (result) {
        req.session.loginData = userData;
        req.session.save();
        console.log(req.session.loginData);
        res.sendStatus(200);
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
      }
      res.sendStatus(200);
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

router.get("/:userUniqueId", async (req, res, next) => {
  const { userUniqueId } = req.params;
  try {
    const result = await User.findAll({
      attributes: ["userUniqueId", "userId", "UserName", "UserNickname"],
      where: { userUniqueId },
    });
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    return next(new InternalServerException());
  }
});

router.put("/", async (req, res, next) => {
  const userDTO = req.params;
  try {
    await User.update({
      userDTO,
      where: {},
    });
  } catch (err) {
    console.log(err);
    return next(new InternalServerException());
  }
});
module.exports = router;
