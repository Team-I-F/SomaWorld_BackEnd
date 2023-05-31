const express = require("express");
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
      `SELECT title, description FROM board WHERE tableId = ${tableID}`
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


module.exports = {
  getTableId,
  getTables,
  getViews
}