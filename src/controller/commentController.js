const express = require("express");
const router = express.Router();
const { Comment, CinC, sequelize } = require("../models");
const {
  InternalServerException,
  NotFoundException,
  BadRequestException,
} = require("../global/exception/Exceptions");

// 댓글ID + 1해서 가져오는거. O
const getCommentId = async (req, res, next) => {
  try {
    const con = await Comment.findOne({
      attributes: [[sequelize.fn("MAX", sequelize.col("commentId")), "m"]],
    });

    if (con && con.m !== null) {
      return con.m + 1;
    }

    return 1;
  } catch (e) {
    console.log(e);
    return next(new NotFoundException());
  }
};

// 댓글 O
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const comments = await Comment.findAll({
      attributes: ["userNickname", "comment", "created"],
      where: { tableId: id },
    });
    res.json(comments);
  } catch (e) {
    console.log(e);
    return next(new NotFoundException());
  }
});

// 대댓글 O
router.get("/cinc/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const replies = await CinC.findAll({
      attributes: ["userNickname", "comment", "created"],
      where: { commentId: id },
    });
    res.json(replies);
  } catch (e) {
    console.log(e);
    return next(NotFoundException());
  }
});

// 댓글 insert O
router.post("/insert", async (req, res, next) => {
  try {
    const commentId = await getCommentId();
    const { tableId, userNickname, comment } = req.body;
    await Comment.create({
      commentId: commentId,
      tableId: tableId,
      userNickname: userNickname,
      comment: comment,
      created: sequelize.literal("NOW()"),
    });
    res.status(200).send();
  } catch (e) {
    console.log(e);
    return next(InternalServerException());
  }
});

// 대댓글 insert O
router.post("/insert/cinc", async (req, res, next) => {
  try {
    const { commentId, userNickname, comment } = req.body;
    await CinC.create({
      commentId: commentId,
      userNickname: userNickname,
      comment: comment,
      created: sequelize.literal("NOW()"),
    });
    res.send(200).send();
  } catch (e) {
    console.log(e);
    return next(InternalServerException());
  }
});

module.exports = router;
