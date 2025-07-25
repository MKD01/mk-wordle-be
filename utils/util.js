exports.getDailyRandomNum = () => {
  const date = new Date();
  const dailyRandomNum =
    date.getDate() * (date.getMonth() + 1) * date.getFullYear();

  return dailyRandomNum;
};

exports.getRandomNum = (x = 10) => {
  const dailyRandomNum = this.getDailyRandomNum();
  let randomNum = Math.floor(Math.random() * x);

  while (dailyRandomNum === randomNum) {
    randomNum = Math.floor(Math.random() * x);
  }

  return randomNum;
};
