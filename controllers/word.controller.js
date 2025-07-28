const {
  fetchDailyWord,
  fetchRandomWordId,
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

exports.submitDailyWord = (req, res, next) => {
  try {
    const wordAttempt = req.body.word;
    const dailyWord = fetchDailyWord();

    const attempt = attemptDailyWord(wordAttempt, dailyWord);

    res.status(201).send({ attempt });
  } catch (err) {
    next(err);
  }
};

exports.getRandomWordId = (req, res, next) => {
  try {
    const wordId = fetchRandomWordId();
    res.status(200).send({ wordId });
  } catch (err) {
    next(err);
  }
};
