const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { Board, Gallery, sequelize } = require("../models");
const { getViews } = require("../function/boardFunction.js");
const multer = require("multer");
const fs = require("fs");
const {
  InternalServerException,
  NotFoundException,
  BadRequestException,
} = require("../global/exception/Exceptions");

try {
  fs.readdirSync("uploads"); // 폴더 확인
} catch (err) {
  console.error("uploads 폴더가 없습니다. 폴더를 생성합니다.");
  fs.mkdirSync("uploads"); // 폴더 생성
}

// 전체 메인 게시판 페이지(큰 게시판 이름(갤러리) 넘어감) O
router.get("/", async (req, res, next) => {
  try {
    const results = await Gallery.findAll();
    res.json(results);
  } catch (e) {
    console.log(e);
    return next(new NotFoundException());
  }
});

// 게시판 메인(게시물 이름, 글쓴이, 쓴 날짜, 조회수), (큰 게시판 누르면 넘어가는 곳. 즉, 갤러리 안쪽.) O
router.get("/:galleryId", async (req, res, next) => {
  try {
    const { galleryId } = req.params;
    const results = await Board.findAll({
      attributes: ["tableId", "title", "userNickname", "created", "views"],
      where: { galleryId },
    });
    res.json(results);
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
    if (!results) res.json("값이 없습니다.");
    else res.json(results);
  } catch (e) {
    console.log(e);
    return next(new NotFoundException());
  }
});

// 검색 O
router.get(`/search/:galleryId/:titles`, async (req, res, next) => {
  try {
    const { galleryId, titles } = req.params;
    const results = await Board.findAll({
      attributes: ["tableId", "title", "userNickname", "created", "views"],
      where: {
        title: {
          [Op.like]: `%${titles}%`,
        },
        galleryId,
      },
    });
    res.json(results);
  } catch (e) {
    console.log(e);
    return next(new NotFoundException());
  }
});

router.post(`/gallery`, async (req, res, next) => {
  try {
    const { galleryName } = req.body;
    await Gallery.create({
      galleryName: galleryName,
    });
    res.status(200).send("OK");
  } catch (e) {
    console.log(e);
    return next(new InternalServerException());
  }
});

// 게시물 작성 O
router.post(`/`, async (req, res, next) => {
  try {
    const { galleryId, title, userNickname, description } = req.body;
    await Board.create({
      galleryId,
      title,
      userNickname,
      description,
      created: sequelize.literal("NOW()"),
      views: 0,
    });
    res.status(200).send("OK");
  } catch (e) {
    console.log(e);
    return next(new InternalServerException());
  }
});

// 게시물 삭제 O
router.delete(`/:tableId`, async (req, res, next) => {
  try {
    console.log("asdasd");
    const { tableId } = req.params;
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
