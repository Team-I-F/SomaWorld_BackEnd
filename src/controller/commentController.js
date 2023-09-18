const express = require("express");
const router = express.Router();
const { Comment, CinC, sequelize } = require("../models");
const {
  InternalServerException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} = require("../global/exception/Exceptions");

// 댓글 O
router.get("/:tableId", async (req, res, next) => {
  try {
    const { tableId } = req.params;
    const comments = await Comment.findAll({
      attributes: ["commentId", "userNickname", "comment", "created"],
      where: { tableId },
    });
    res.json(comments);
  } catch (e) {
    return next(new NotFoundException());
  }
});

// 대댓글 O
router.get("/cinc/:commentId", async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const replies = await CinC.findAll({
      attributes: ["cincId", "userNickname", "comment", "created"],
      where: { commentId },
    });
    res.json(replies);
  } catch (e) {
    console.log(e);
    return next(new NotFoundException());
  }
});

// 댓글 insert O
router.post("/", async (req, res, next) => {
  try {
    if (!req.session.loginData) return next(new BadRequestException());
    const { tableId, comment } = req.body;
    await Comment.create({
      tableId: tableId,
      userNickname: req.session.loginData.userNickname,
      comment: comment,
      created: sequelize.literal("NOW()"),
    });
    res.status(200).send();
  } catch (e) {
    console.log(e);
    return next(new InternalServerException());
  }
});

// 대댓글 insert O
router.post("/cinc", async (req, res, next) => {
  try {
    if (!req.session.loginData) return next(new BadRequestException());
    const { commentId, comment } = req.body;
    await CinC.create({
      commentId: commentId,
      userId: req.session.loginData.userId,
      userNickname: req.session.loginData.userNickname,
      comment: comment,
      created: sequelize.literal("NOW()"),
    });
    res.send(200).send();
  } catch (e) {
    console.log(e);
    return next(new InternalServerException());
  }
});

router.put("/:commentId", async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { comment, userId } = req.body;

    if (req.session.loginData.userId !== userId) {
      if (req.session.loginData.admin !== true)
        return next(new ForbiddenException());
    }

    const info = await Comment.findOne({
      where: {
        commentId,
      },
    });
    if (!info) {
      return next(new NotFoundException());
    }
    info.comment = comment;

    await info.save();
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return next(new InternalServerException());
  }
});

router.put("/cinc/:cincId", async (req, res) => {
  const { cincId } = req.params;
  const { comment, userId } = req.body;
  try {
    if (req.session.loginData.userId !== userId) {
      if (req.session.loginData.admin !== true)
        return next(new ForbiddenException());
    }
    const info = await CinC.findOne({
      where: {
        cincId,
      },
    });
    if (!info) {
      return next(new NotFoundException());
    }
    info.comment = comment;

    await info.save();
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return next(new InternalServerException());
  }
});

router.delete("/:tableId", async (req, res) => {
  const { tableId } = req.params;
  if (!tableId) return next(new NotFoundException());

  try {
    await Comment.delete({
      where: {
        tableId,
      },
    });
  } catch (err) {
    console.log(err);
    return next();
  }
});

router.delete("/cinc/:cincId", async (req, res) => {
  const { cincId } = req.params;
  if (!cincId) return next(new NotFoundException());
  if (req.session.loginData.userId !== userId) {
    if (req.session.loginData.admin !== true)
      return next(new ForbiddenException());
  }
  try {
    await CinC.delete({
      where: {
        cincId,
      },
    });
  } catch (err) {
    console.log(err);
    return next(InternalServerException());
  }
});
module.exports = router;
