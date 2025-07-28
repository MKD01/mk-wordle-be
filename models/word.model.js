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

exports.attemptDailyWord = (wordAttempt, dailyWord) => {
  if (typeof wordAttempt !== "string") {
    throw { status: 400, msg: "Invalid word" };
  }

  if (wordAttempt.length !== 5) {
    throw { status: 400, msg: "Invalid word length" };
  }

  const validatedChars = validateWord(wordAttempt, dailyWord);

  return { letters: validatedChars };
};

exports.fetchRandomWord = () => {
  const { words } = require("../words.json");

  const randomWordIndex = getRandomNum(words.length);
  const randomWord = words[randomWordIndex];

  return randomWord;
};
