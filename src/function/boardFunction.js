const { Board } = require("../models");

const getViews = async (tableID) => {
  try {
    const board = await Board.findOne({
      where: { tableId: tableID },
      attributes: ["views"],
    });

    if (board) {
      return board.views;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
};

const getTables = async (tableID) => {
  try {
    const board = await Board.findOne({
      where: { tableId: tableID },
      attributes: ["title", "description"],
    });

    if (board) {
      return { title: board.title, description: board.description };
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
};

const getTableId = async () => {
  try {
    const maxTableId = await Board.max("tableId");
    return maxTableId ? maxTableId + 1 : 1;
  } catch (e) {
    console.error(e);
    return null;
  }
};

module.exports = {
  getTableId,
  getTables,
  getViews,
};
