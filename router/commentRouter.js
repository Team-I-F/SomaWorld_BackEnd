const express = require("express");
const router = express.Router();
const db = require("../db/database.js");

// 댓글ID + 1해서 가져오는거. O
const getCommentId = async () => {
  try {
    let con = await db.query(`SELECT max(commentId) + 1 as m FROM comment`);
    if (con.length) {
      let values = Object.values(con[0]);
      values = JSON.stringify(values).replace(/^\[|\]$/g, "");
      values = JSON.parse(values);

      return values.m;
    }
  } catch (e) {
    console.log(e);
  }
};
//댓글 O
router.get(`/:id`, async (req, res) => {
  try {
    let { id } = req.params;
    sql = await db.query(
      `SELECT userNickname, comment, created from comment WHERE tableId = ${id}`
    );
    let [result] = sql;
    res.json(result);
  } catch (e) {
    console.log(e);
    res.status(404).send();
  }
});

//대댓글 O
router.get(`/cinc/:id`, async (req, res) => {
  try {
    let { id } = req.params;
    sql = await db.query(
      `SELECT userNickname, comment, created from CinC WHERE commentId = ${id}`
    );
    let [result] = sql;
    res.json(result);
  } catch (e) {
    console.log(e);
    res.status(404).send();
  }
});

//댓글insert O
router.post("/insert", async (req, res) => {
  try {
    let commentId = await getCommentId();
    let { tableId, userNickname, comment } = req.body;
    sql = await db.query(
      `INSERT INTO comment VALUES(${commentId}, ${tableId}, '${userNickname}', '${comment}', now())`
    );
    res.status(200).send();
    return sql;
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

//대댓글 insert O
router.post("/insert/cinc", async (req, res) => {
  try {
    let { commentId, userNickname, comment } = req.body;
    sql = await db.query(
      `INSERT INTO CinC VALUES(${commentId}, '${userNickname}', '${comment}', now())`
    );
    res.send(200).send();
  } catch (e) {
    console.log(e);
    res.send(500).send();
  }
});
module.exports = router;
