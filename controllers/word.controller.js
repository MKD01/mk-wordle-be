const { fetchDailyWord, fetchRandomWord } = require("../models/word.model");

exports.getDailyWord = (req, res, next) => {
  try {
    const word = fetchDailyWord();
    res.status(200).send({ word });
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
