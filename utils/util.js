exports.getDailyRandomNum = () => {
  const date = new Date();
  const dailyRandomNum =
    date.getDate() * (date.getMonth() + 1) * date.getFullYear();

  return dailyRandomNum;
};

exports.getRandomNum = (x = 10) => {
  return Math.floor(Math.random() * x);
};
