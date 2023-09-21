const express = require("express");
const search = require("../models/search");
const router = express.Router();
const { Op } = require("sequelize");
const { Search } = require("../models");

router.get("/", async (req, res) => {
  try {
    const result = await Search.findAll({
      order: [["count", "DESC"]],
      limit: 10,
    });
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    return res.sendStatus(404);
  }
});
module.exports = router;
