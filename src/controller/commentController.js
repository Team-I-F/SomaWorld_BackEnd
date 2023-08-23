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
router.get("/:tableId", async (req, res, next) => {
  try {
    const { tableId } = req.params;
    const comments = await Comment.findAll({
      attributes: ["userNickname", "comment", "created"],
      where: { tableId },
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
router.post("/", async (req, res, next) => {
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
router.post("/cinc", async (req, res, next) => {
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

router.put("/:tableId", async (req, res, next) => {
  try {
    const { tableId } = req.params;
    const { userNickname, comment } = req.body;
    const info = await Comment.findOne({
      where: {
        tableId,
      },
    });
    if (!info) {
      return res.status(404).send("Not Found");
    }
    info.userNickname = userNickname;
    info.comment = comment;

    await info.save();
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return next(InternalServerException());
  }
});

router.put("/cinc/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { userNickname, comment } = req.body;
  try {
    const info = await CinC.findOne({
      where: {
        commentId,
      },
    });
    if (!info) {
      return next(NotFoundException());
    }
    info.userNickname = userNickname;
    info.comment = comment;

    await info.save();
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return next(InternalServerException());
  }
});

router.delete("/:tableId", async (req, res) => {
  const { tableId } = req.params;
  if (!tableId) return next(NotFoundException());

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

router.delete("/cinc/:commentId", async (req, res) => {
  const { commentId } = req.params;
  if (!commentId) return next(NotFoundException());
  try {
    await CinC.delete({
      where: {
        commentId,
      },
    });
  } catch (err) {
    console.log(err);
    return next(InternalServerException());
  }
});
module.exports = router;
