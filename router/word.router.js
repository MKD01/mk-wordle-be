const express = require("express");
const {
  getDailyWord,
  submitDailyWord,
  submitWordById,
  getWordById,
} = require("../controllers/word.controller");

const wordRouter = express.Router();

wordRouter.get("/daily", getDailyWord);
wordRouter.post("/daily", submitDailyWord);

wordRouter.get("/:wordId", getWordById);
wordRouter.post("/:wordId", submitWordById);

module.exports = wordRouter;
