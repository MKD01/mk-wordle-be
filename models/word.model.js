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

exports.fetchRandomWordIds = (quantity = 1) => {
  const { words } = require("../words.json");
  const wordIndexs = [];

  if (isNaN(+quantity)) {
    throw { status: 400, msg: "Bad request" };
  }

  if (quantity > 10) quantity = 10;

  while (quantity > 0) {
    const randomWordIndex = getRandomNum(words.length);

    if (!wordIndexs.includes(randomWordIndex)) {
      wordIndexs.push(randomWordIndex);
      quantity--;
    }
  }

  return wordIndexs;
};

exports.fetchWordById = (id) => {
  const { words } = require("../words.json");

  if (typeof id !== "string" && isNaN(+id)) {
    throw { status: 400, msg: "Invalid wordId" };
  }

  if (words.length <= id) {
    throw { status: 404, msg: "wordId not found" };
  }

  const word = words[id];
  return word;
};
