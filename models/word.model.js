const {
  getDailyRandomNum,
  getRandomNum,
  validateWord,
} = require("../utils/util");

exports.fetchDailyWord = () => {
  const { words } = require("../words.json");

  const randomDailyIndex = getDailyRandomNum() % words.length;
  const dailyWord = words[randomDailyIndex];

  return dailyWord;
};

exports.attemptWord = (wordAttempt, wordToGuess) => {
  if (typeof wordAttempt !== "string") {
    throw { status: 400, msg: "Invalid word" };
  }

  if (wordAttempt.length !== 5) {
    throw { status: 400, msg: "Invalid word length" };
  }

  const validatedChars = validateWord(wordAttempt, wordToGuess);

  return { letters: validatedChars };
};

exports.fetchRandomWordId = () => {
  const { words } = require("../words.json");

  const randomWordIndex = getRandomNum(words.length);

  return randomWordIndex;
};

exports.fetchWordById = (id) => {
  const { words } = require("../words.json");

  if (typeof id !== "string" && isNaN(+id)) {
    throw { status: 400, msg: "wordId not valid" };
  }

  if (words.length <= id) {
    throw { status: 404, msg: "wordId not found" };
  }

  const word = words[id];
  return word;
};
