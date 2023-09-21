const express = require("express");
const search = require("../models/search");
const router = express.Router();
const { Op } = require("sequelize");

router.post("/", async (req, res) => {
  const word = req.body;
  try {
    const result = await search.findAll({
      where: {
        word,
      },
    });
    if (result) {
      result.count + 1;
      result.save();
      return res.sendStatus(200);
    }
    await search.create({
      word,
      count: 0,
    });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

module.exports = router;
