const express = require("express");
const router = express.Router();
const db = require("../db/database.js");

//테이블 타이틀, 내용 넘겨주는 함수
const getTables = async (tableID) => {
  let con = await db.query(
    `SELECT views FROM board WHERE tableId = ${tableID}`
  );
  if (con.length) {
    let values = Object.values(con[0], [1]);
    values = JSON.stringify(values).replace(/^\[|\]$/g, "");
    values = JSON.parse(values);
    return values.title, values.description;
  } else return null;
};

const getViews = async (tableID) => {
  let con = await db.query(
    `SELECT views FROM board WHERE tableId = ${tableID}`
  );
  if (con.length) {
    let values = Object.values(con[0]);
    values = JSON.stringify(values).replace(/^\[|\]$/g, "");
    values = JSON.parse(values);
    return values.views;
  } else return null;
};

//테이블아이디 넘겨주는 함수
const getTableId = async (tableID) => {
  let con = await db.query(`SELECT max(tableId)+1 as m FROM board `);
  if (con.length) {
    let values = Object.values(con[0]);
    values = JSON.stringify(values).replace(/^\[|\]$/g, "");
    values = JSON.parse(values);
    return values.m;
  } else return null;
};

//전체 메인 게시판 페이지(큰게시판이름(갤러리) 넘어감) O
router.get("/", async (req, res) => {
  try {
    sql = await db.query("SELECT * from boardInfo");
    let [results] = sql;
    res.json(results);
  } catch (e) {
    console.log(e);
    res.status(500).send("500 error");
  }
});

// 게시판 메인(게시물 이름, 글쓴이, 쓴날짜, 조회수),(큰게시판 누르면 넘어가는곳. 즉, 갤러리 안쪽.) O
router.get("/:boardID", async (req, res) => {
  try {
    let { boardID } = req.params;
    sql = await db.query(
      `SELECT title, userNickname, created, views FROM board WHERE tableInfoid = ${boardID}`
    );
    let [results] = sql;
    res.json(results);
  } catch (e) {
    console.log(e);
    res.status(500).send("500 error");
  }
});

// 게시판 상세(갤러리 내 게시판 누르면 넘어가는 상세 페이지) + 조회수 증가 O
router.get(`/:tableInfoID/:boardID`, async (req, res) => {
  try {
    let { tableInfoID, boardID } = req.params;
    let views = await getViews(boardID);
    await db.query(`update board set views = ${views} + 1 where tableId = ${boardID};`)
    sql = await db.query(
      `SELECT tableID, title, userNickname, description, created, views FROM board WHERE tableId = ${boardID} and tableInfoId = ${tableInfoID}`
    );
    let [results] = sql;
    
    res.json(results);
  } catch (e) {
    console.log(e);
    res.status(500).send("500 error");
  }
});

//검색 O
router.get(`/search/title/:titles`, async (req, res) => {
  try {
    let { titles } = req.params;
    sql = await db.query(
      `SELECT title,userNickname,created FROM board WHERE title LIKE '%${titles}%'`
    );
    let [results] = sql;
    res.json(results);
  } catch (e) {
    console.log(e);
    res.status(500).send("500 error");
  }
});

//삭제 O
router.delete(`/delete/:tableID`, async (req, res) => {
  try {
    let { tableID } = req.params;
    sql = await db.query(`DELETE FROM board WHERE tableId = ${tableID}`);
    res.send(200);
  } catch (e) {
    console.log(e);
    res.status(500).send("500 error");
  }
});

// 게시물 작성 O
router.post(`/insert`, async (req, res) => {
  try {
    let { tableInfoId, title, userNickname, description } = req.body;
    let tableId = await getTableId();
    sql = await db.query(
      `INSERT INTO board VALUES(${tableInfoId},${tableId},'${title}','${userNickname}','${description}',now(),0)`
    );
    res.status(200).send("OK");
    return sql;
  } catch (e) {
    console.log(e);
    res.status(500).send("500 error");
  }
});



//구현중
router.get(`/update/:tableID`, async (req, res) => {
  try {
    let tableID = req.params;
    let tables = await getTables(tableID);
    res.send(200);
  } catch (e) { 
    console.log(e);
    res.status(500).send("500 error");
  }
});

module.exports = router;
