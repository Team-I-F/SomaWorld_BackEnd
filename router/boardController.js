const express = require("express");
const router = express.Router();
const db = require("../db/database.js");

//전체 메인 게시판 페이지(큰게시판이름(갤러리) 넘어감)
router.get("/board", async (req, res) => {
  try{
    sql = await db.query("SELECT * from boardInfo");
    let [results] = sql;
    res.json(results);
  } catch (e){
    console.log(e);
    res.status(500).send("500 error")
  }
  
});

// 게시판 메인(게시물 이름, 글쓴이, 쓴날짜, 조회수),(큰게시판 누르면 넘어가는곳. 즉, 갤러리 안쪽.)
router.get("/board/:boardID", async (req, res) => {
  try{
    let {boardID} = req.params;
    sql = await db.query(`SELECT title, userNickname, created, views FROM board WHERE tableInfoid = ${boardID}`);
    let [results] = sql;
    res.json(results);
  } catch (e){
    console.log(e);
    res.status(500).send("500 error");
  }

});

//검색
router.get(`/board/search/title/:titles`, async (req, res) => {
  try{
    let {titles} = req.params;
    sql = await db.query(`SELECT title,userNickname,created FROM board WHERE title LIKE '%${titles}%'`);
    let [results] = sql;
    res.json(results);
  }catch(e){
    console.log(e);
    res.status(500).send("500 error");
  }
});

// 게시판 상세(갤러리 내 게시판 누르면 넘어가는 상세 페이지)
router.get(`/board/:boardID/:tableID`, async (req, res) => {
  try{
    let { tableID, boardID } = req.params;
    sql = await db.query(`SELECT tableID, title, userNickname, description, created, views FROM board WHERE tableId = ${tableID} and tableInfoId = ${boardID}`);
    let [results] = sql;
    res.json(results);
  }catch(e){
    console.log(e);
    res.status(500).send("500 error")
  }
});

// 게시물 작성
router.post(`/board/insert`, async (req, res) => {
try {
  let { tableInfoId, title, userNickname, description } = req.body;
  let tableId = await getTableId();
  sql = await db.query(`INSERT INTO board VALUES(${tableInfoId},${tableId},'${title}','${userNickname}','${description}',now(),0)`)
  res.status(200).send("OK");
  return sql;
} catch (e) {
  console.log(e);
  res.status(500).send("500 error");
} 
  
});
//테이블아이디 넘겨주는 함수
const getTableId = async() => {
  let con  = await db.query(
  `SELECT max(tableId)+1 as m FROM board ` )
    if (con.length){
      let values = Object.values(con[0]);
      values = JSON.stringify(values).replace(/^\[|\]$/g, '');
      values = JSON.parse(values);
      return(values.m);
  }
    else return null;

};




module.exports = router;
