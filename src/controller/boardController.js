const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { Board, Gallery, sequelize, Sequelize, Search } = require("../models");
const { getViews } = require("../function/boardFunction.js");
const upload = require("../middleware/multers");
const fs = require("fs");
const {
  InternalServerException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} = require("../global/exception/Exceptions");
const search = require("../models/search");

// 전체 메인 게시판 페이지(큰 게시판 이름(갤러리) 넘어감) O
router.get("/", async (req, res, next) => {
  try {
    const results = await Gallery.findAll({
      attributes: ["galleryId", "galleryName"],
    });
    res.status(200).json(results);
  } catch (e) {
    console.log(e);
    return next(new NotFoundException());
  }
});

// 게시판 메인
router.get("/:galleryId", async (req, res, next) => {
  try {
    const { galleryId } = req.params;
    const results = await Board.findAll({
      attributes: [
        "tableId",
        "title",
        "userNickname",
        "description",
        "created",
        "views",
      ],
      where: { galleryId },
    });
    res.status(200).json(results);
  } catch (e) {
    console.log(e);
    return next(new NotFoundException());
  }
});

// 게시판 상세(갤러리 내 게시판 누르면 넘어가는 상세 페이지) + 조회수 증가 O
router.get("/:galleryId/:tableId", async (req, res, next) => {
  try {
    const { galleryId, tableId } = req.params;
    let views = await getViews(tableId);

    await Board.update(
      { views: views + 1 },
      {
        where: {
          tableId,
        },
      }
    );

    const results = await Board.findOne({
      attributes: [
        "tableId",
        "title",
        "userNickname",
        "description",
        "created",
        "views",
      ],
      where: {
        tableId,
        galleryId,
      },
    });
    if (!results) return next(new NotFoundException());
    else res.status(200).json(results);
  } catch (e) {
    console.log(e);
    return next(new NotFoundException());
  }
});

// 검색 O
router.get(`/search/:galleryId/:word`, async (req, res, next) => {
  try {
    const { galleryId, word } = req.params;
    const results = await Board.findAll({
      attributes: ["tableId", "title", "userNickname", "created", "views"],
      where: {
        title: {
          [Op.like]: `%${word}%`,
        },
        galleryId,
      },
    });
    const find = await Search.findAll({
      where: {
        word,
      },
    });
    if (find.length === 0) {
      console.log(1);
      await Search.create({
        word,
        count: 0,
      });
      return res.status(200).json(results);
    }
    await Search.increment("count", {
      by: 1,
      where: { word },
    });

    res.status(200).json(results);
  } catch (e) {
    console.log(e);
    return next(new NotFoundException());
  }
});

router.post(`/gallery`, async (req, res, next) => {
  try {
    if (!req.session.loginData) return next(new BadRequestException());
    const { galleryName } = req.body;
    await Gallery.create({
      galleryName: galleryName,
    });
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    return next(new InternalServerException());
  }
});

// 게시물 작성 O
router.post(`/`, async (req, res, next) => {
  try {
    if (!req.session.loginData) return next(new BadRequestException());
    const { galleryId, title, description } = req.body;
    const result = await Board.findOne({
      attributes: [[Sequelize.literal("max(tableId)"), "tableId"]],
    });
    const maxId = result.dataValues.tableId;
    const nextId = maxId + 1;
    await Board.create({
      galleryId,
      title,
      userId: req.session.loginData.userId,
      userNickname: req.session.loginData.userNickname,
      description,
      created: sequelize.literal("NOW()"),
      views: 0,
    });
    res.status(200).json({ tableId: nextId });
  } catch (e) {
    console.log(e);
    return next(new InternalServerException());
  }
});

router.put(
  "/image/:tableId",
  upload.single("image"),
  async (req, res, next) => {
    const { tableId } = req.params;
    const image = req.file.filename;
    try {
      const results = await Board.findOne({
        where: {
          tableId,
        },
      });
      results.image = image;
      await results.save();
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      return next(new InternalServerException());
    }
  }
);

router.put("/gallery/:galleryId", async (req, res, next) => {
  const { galleryId } = req.params;
  const { galleryName, userId } = req.body;
  try {
    if (req.session.loginData.userId !== userId) {
      if (req.session.loginData.admin !== true)
        return next(new ForbiddenException());
    }
    const results = await Gallery.findOne({
      where: { galleryId },
    });
    results.galleryName = galleryName;
    await results.save();
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return next(new InternalServerException());
  }
});

// 게시물 삭제 O
router.delete(`/:tableId`, async (req, res, next) => {
  try {
    const { tableId } = req.params;
    const { userId } = await Board.findOne({
      attributes: ["userId"],
      where: { tableId },
    });
    console.log(userNickname);
    if (req.session.loginData.userId !== userId) {
      if (req.session.loginData.admin !== true)
        return next(new ForbiddenException());
    }
    await Board.destroy({
      where: {
        tableId,
      },
    });
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    return next(new BadRequestException());
  }
});

// 갤러리 삭제
router.delete("/gallery/:galleryId", async (req, res, next) => {
  if (req.session.loginData.admin === false)
    return next(new ForbiddenException());
  try {
    const { galleryId } = req.params;
    await Gallery.destroy({
      where: {
        galleryId,
      },
    });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return next(new NotFoundException());
  }
});

module.exports = router;
