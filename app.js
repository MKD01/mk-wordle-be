const express = require("express");
const { getEndpoints } = require("./controllers/api.controller");
const {
  getDailyWord,
  submitDailyWord,
  getRandomWordIds,
  submitWordById,
  getWordById,
} = require("./controllers/word.controller");
const {
  customErrorHandler,
  serverErrorHandler,
  invalidPathHandler,
} = require("./middleware/errors");

const app = express();

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/word/daily", getDailyWord);

app.post("/api/word/daily", submitDailyWord);

app.get("/api/wordIds", getRandomWordIds);

app.get("/api/word/:wordId", getWordById);

app.post("/api/word/:wordId", submitWordById);

app.use(invalidPathHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app;
