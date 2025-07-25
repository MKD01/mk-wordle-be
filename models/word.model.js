const { getDailyRandomNum, getRandomNum } = require("../utils/util");

exports.fetchDailyWord = () => {
  const { words } = require("../words.json");

  const randomDailyIndex = getDailyRandomNum() % words.length;
  const dailyWord = words[randomDailyIndex];

  return dailyWord;
};

exports.fetchRandomWord = () => {
  const { words } = require("../words.json");

  const randomWordIndex = getRandomNum(words.length);
  const randomWord = words[randomWordIndex];

  return randomWord;
};
