const express = require("express");
const { getEndpoints } = require("./controllers/api.controller");
const { getDailyWord } = require("./controllers/word.controller");
const { getRandomWord } = require("./controllers/word.controller");

const app = express();

app.get("/api", getEndpoints);

app.get("/api/word/daily", getDailyWord);

app.get("/api/word", getRandomWord);

app.use((req, res) => {
  res.status(404).send({ msg: "Page Not Found" });
});

app.use((err, req, res, next) => {
  res.status(500).send({ error: "Server Error" });
});

module.exports = app;
