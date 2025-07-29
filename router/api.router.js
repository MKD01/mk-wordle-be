const express = require("express");
const {
  getDailyWord,
  submitDailyWord,
  getRandomWordIds,
  submitWordById,
  getWordById,
} = require("../controllers/word.controller");
const wordRouter = require("./word.router");
const { getEndpoints } = require("../controllers/api.controller");

const apiRouter = express.Router();

apiRouter.get("/", getEndpoints);

apiRouter.use("/word", wordRouter);

apiRouter.get("/wordIds", getRandomWordIds);

module.exports = apiRouter;
