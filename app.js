const express = require("express");
const { getEndpoints } = require("./controllers/api.controller");
const {
  getDailyWord,
  postDailyWord,
  getRandomWord,
} = require("./controllers/word.controller");

const app = express();

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/word/daily", getDailyWord);

app.post("/api/word/daily", postDailyWord);

app.get("/api/word", getRandomWord);

app.use((req, res) => {
  res.status(404).send({ msg: "Page Not Found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ err: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ error: "Server Error" });
});

module.exports = app;
