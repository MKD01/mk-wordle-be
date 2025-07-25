exports.fetchDailyWord = () => {
  const { words } = require("../words.json");

  const date = new Date();
  const randomDailyIndex =
    (date.getDate() * date.getMonth() * date.getFullYear()) % words.length;

  const dailyWord = words[randomDailyIndex];

  return dailyWord;
};

exports.fetchRandomWord = () => {
  const { words } = require("../words.json");

  const randomWordIndex = Math.floor(Math.random() * words.length);
  const randomWord = words[randomWordIndex];

  return randomWord;
};
