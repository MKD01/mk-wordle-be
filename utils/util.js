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

exports.validateWord = (attemptWord, wordToGuess) => {
  const matchedCharIndexs = [];

  const dailyWordChars = wordToGuess.split("");

  const validatedChars = attemptWord.split("").map((char, i) => {
    const currDailyChar = dailyWordChars[i];

    if (char === currDailyChar) {
      const validatedChar = {
        char,
        isValidChar: true,
        isValidPosition: true,
      };

      matchedCharIndexs.push(i);

      return validatedChar;
    }

    return {
      char,
      isValidChar: false,
      isValidPosition: false,
    };
  });

  matchedCharIndexs.reverse().forEach((i) => {
    dailyWordChars.splice(i, 1);
  });

  validatedChars.forEach((validatedChar, i) => {
    if (
      matchedCharIndexs.includes(i) ||
      !dailyWordChars.includes(validatedChar.char)
    ) {
      return validatedChar;
    }

    const dailyCharIndex = dailyWordChars.findIndex(
      (char) => char === validatedChar.char
    );

    dailyWordChars.splice(dailyCharIndex, 1);

    validatedChar.isValidChar = true;
  });

  return validatedChars;
};
