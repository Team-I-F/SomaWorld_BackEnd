const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { Board, BoardInfo, sequelize } = require("../models");
const { getViews } = require("../function/boardFunction.js");
const multer = require("multer");
const fs = require("fs");

try {
  fs.readdirSync("uploads"); // 폴더 확인
} catch (err) {
  console.error("uploads 폴더가 없습니다. 폴더를 생성합니다.");
  fs.mkdirSync("uploads"); // 폴더 생성
}

// 전체 메인 게시판 페이지(큰 게시판 이름(갤러리) 넘어감) O
router.get("/", async (req, res) => {
  try {
    const results = await BoardInfo.findAll();
    res.json(results);
  } catch (e) {
    console.log(e);
    res.status(404).send();
  }
});

// 게시판 메인(게시물 이름, 글쓴이, 쓴 날짜, 조회수), (큰 게시판 누르면 넘어가는 곳. 즉, 갤러리 안쪽.) O
router.get("/:boardID", async (req, res) => {
  try {
    const { boardID } = req.params;
    const results = await Board.findAll({
      attributes: ["title", "userNickname", "created", "views"],
      where: { tableInfoid: boardID },
    });
    res.json(results);
  } catch (e) {
    console.log(e);
    res.status(404).send();
  }
});

// 게시판 상세(갤러리 내 게시판 누르면 넘어가는 상세 페이지) + 조회수 증가 O
router.get("/:tableInfoID/:boardID", async (req, res) => {
  try {
    const { tableInfoID, boardID } = req.params;
    let views = await getViews(boardID);

    await Board.update(
      { views: views + 1 },
      {
        where: {
          tableId: boardID,
        },
      }
    );

    const results = await Board.findOne({
      attributes: [
        "tableID",
        "title",
        "userNickname",
        "description",
        "created",
        "views",
      ],
      where: {
        tableId: boardID,
        tableInfoId: tableInfoID,
      },
    });
    if (results === null) res.json("값이 없습니다.");
    else res.json(results);
  } catch (e) {
    console.log(e);
    res.status(404).send("404 error");
  }
});

// 검색 O
router.get(`/search/title/:titles`, async (req, res) => {
  try {
    const { titles } = req.params;
    const results = await Board.findAll({
      attributes: ["title", "userNickname", "created"],
      where: {
        title: {
          [Op.like]: `%${titles}%`,
        },
      },
    });
    res.json(results);
  } catch (e) {
    console.log(e);
    res.status(404).send();
  }
});

// 삭제 O
router.delete(`/:tableID`, async (req, res) => {
  try {
    console.log("asdasd");
    const { tableID } = req.params;
    await Board.destroy({
      where: {
        tableId: tableID,
      },
    });
    res.send(200);
  } catch (e) {
    console.log(e);
    res.status(400).send();
  }
});
router.post(`/gallery`, async (req, res) => {
  try {
    const { tableName } = req.body;
    await BoardInfo.create({
      tableName: tableName,
    });
    res.status(200).send("OK");
  } catch (e) {
    console.log(e);
    res.status(500).send("500 error");
  }
});
// 게시물 작성 O
router.post(`/`, async (req, res) => {
  try {
    const { tableInfoId, title, userNickname, description } = req.body;
    await Board.create({
      tableInfoId: tableInfoId,
      title: title,
      userNickname: userNickname,
      description: description,
      created: sequelize.literal("NOW()"),
      views: 0,
    });
    res.status(200).send("OK");
  } catch (e) {
    console.log(e);
    res.status(500).send("500 error");
  }
});

module.exports = router;
