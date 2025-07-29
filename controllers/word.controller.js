const {
  fetchDailyWord,
  fetchRandomWordIds,
  fetchWordById,
  attemptWord,
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

    const attempt = attemptWord(wordAttempt, dailyWord);

    res.status(201).send({ attempt });
  } catch (err) {
    next(err);
  }
};

exports.getRandomWordIds = (req, res, next) => {
  try {
    const quantity = req.query.q;
    const wordIds = fetchRandomWordIds(quantity);

    res.status(200).send({ wordIds });
  } catch (err) {
    next(err);
  }
};

exports.getWordById = (req, res, next) => {
  try {
    const { wordId } = req.params;
    const word = fetchWordById(+wordId);

    res.status(200).send({ word });
  } catch (err) {
    next(err);
  }
};

exports.submitWordById = (req, res, next) => {
  try {
    const { wordId } = req.params;
    const wordAttempt = req.body.word;

    const wordToGuess = fetchWordById(+wordId);
    const attempt = attemptWord(wordAttempt, wordToGuess);

    res.status(201).send({ attempt });
  } catch (err) {
    next(err);
  }
};
