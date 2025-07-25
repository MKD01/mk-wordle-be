exports.getDailyRandomNum = () => {
  const date = new Date();
  const dailyRandomNum =
    date.getDate() * (date.getMonth() + 1) * date.getFullYear();

  return dailyRandomNum;
};
