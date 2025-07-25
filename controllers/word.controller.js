const { fetchDailyWord } = require("../models/word.model");

exports.getDailyWord = async (req, res, next) => {
  try {
    const word = fetchDailyWord();
    res.status(200).send({ word });
  } catch (err) {
    next(err);
  }
};
