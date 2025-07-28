const {
  fetchDailyWord,
  fetchRandomWord,
  attemptDailyWord,
} = require("../models/word.model");

exports.getDailyWord = (req, res, next) => {
  try {
    const word = fetchDailyWord();
    res.status(200).send({ word });
  } catch (err) {
    next(err);
  }
};

exports.postDailyWord = (req, res, next) => {
  try {
    const wordAttempt = req.body.word;
    const dailyWord = fetchDailyWord();

    const attempt = attemptDailyWord(wordAttempt, dailyWord);

    res.status(201).send({ attempt });
  } catch (err) {
    next(err);
  }
};

exports.getRandomWord = (req, res, next) => {
  try {
    const word = fetchRandomWord();
    res.status(200).send({ word });
  } catch (err) {
    next(err);
  }
};
