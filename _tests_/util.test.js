const {
  getDailyRandomNum,
  getRandomNum,
  validateWord,
} = require("../utils/util");

describe("getDailyRandomNum", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2025-01-01T00:00:00Z"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should return a number", () => {
    const num = getDailyRandomNum();

    expect(typeof num).toBe("number");
  });

  it("should return the same number each time", () => {
    const num1 = getDailyRandomNum();
    const num2 = getDailyRandomNum();

    expect(num1).toBe(num2);
  });

  it("should give back a different number if the date has changed between invocations", () => {
    const num1 = getDailyRandomNum();

    jest.setSystemTime(new Date("2025-01-02T00:00:00Z"));

    const num2 = getDailyRandomNum();

    expect(num1).not.toBe(num2);
    jest.setSystemTime(new Date("2025-01-01T00:00:00Z"));
  });
});

describe("getRandomNum", () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date("2025-01-01T00:00:00Z"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should return a number", () => {
    const num = getRandomNum();

    expect(typeof num).toBe("number");
  });

  it("can take an argument to determine how high the random number can be", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.42);

    const num1 = getRandomNum(10);
    expect(num1).toBe(4);

    const num2 = getRandomNum(100);
    expect(num2).toBe(42);

    Math.random.mockRestore();
  });

  it("should not return the same number as getDailyRandomNum", () => {
    let updatedRandomNum = 2024;

    const updatedRandomFun = () => {
      updatedRandomNum++;
      return updatedRandomNum / 10000;
    };

    jest.spyOn(Math, "random").mockImplementation(updatedRandomFun);

    const randomNum = getRandomNum(10000);
    const randomDailyNum = getDailyRandomNum();

    expect(randomNum).not.toBe(randomDailyNum);
    expect(Math.random).toHaveBeenCalledTimes(2);

    Math.random.mockRestore();
  });
});

describe("validateWord", () => {
  it("should return an array of objects for each character of an attempt word that is validated against a word to be guessed", () => {
    const attemptWord = "spelt";
    const wordToGuess = "bound";

    const output = validateWord(attemptWord, wordToGuess);

    const expectedOutput = [
      { char: "s", isValidChar: false, isValidPosition: false },
      { char: "p", isValidChar: false, isValidPosition: false },
      { char: "e", isValidChar: false, isValidPosition: false },
      { char: "l", isValidChar: false, isValidPosition: false },
      { char: "t", isValidChar: false, isValidPosition: false },
    ];

    expect(output).toEqual(expectedOutput);
  });

  it("should correctly show all characters match when the words are the same", () => {
    const attemptWord = "smelt";
    const wordToGuess = "smelt";

    const output = validateWord(attemptWord, wordToGuess);

    const expectedOutput = [
      { char: "s", isValidChar: true, isValidPosition: true },
      { char: "m", isValidChar: true, isValidPosition: true },
      { char: "e", isValidChar: true, isValidPosition: true },
      { char: "l", isValidChar: true, isValidPosition: true },
      { char: "t", isValidChar: true, isValidPosition: true },
    ];

    expect(output).toEqual(expectedOutput);
  });

  it("should correctly show the characters that are valid and in the right position with atleast one character that is not", () => {
    const attemptWord = "spelt";
    const wordToGuess = "smelt";

    const output = validateWord(attemptWord, wordToGuess);

    const expectedOutput = [
      { char: "s", isValidChar: true, isValidPosition: true },
      { char: "p", isValidChar: false, isValidPosition: false },
      { char: "e", isValidChar: true, isValidPosition: true },
      { char: "l", isValidChar: true, isValidPosition: true },
      { char: "t", isValidChar: true, isValidPosition: true },
    ];

    expect(output).toEqual(expectedOutput);
  });

  it("should correctly show characters that are valid but not in the correct positions", () => {
    const attemptWord = "telms";
    const wordToGuess = "smelt";

    const output = validateWord(attemptWord, wordToGuess);

    const expectedOutput = [
      { char: "t", isValidChar: true, isValidPosition: false },
      { char: "e", isValidChar: true, isValidPosition: false },
      { char: "l", isValidChar: true, isValidPosition: false },
      { char: "m", isValidChar: true, isValidPosition: false },
      { char: "s", isValidChar: true, isValidPosition: false },
    ];

    expect(output).toEqual(expectedOutput);
  });

  it("should correctly show a mix of characters that are valid but not in the correct positions, characters that are valid and in the right positon and incorrect characters", () => {
    const attemptWord = "smled";
    const wordToGuess = "smelt";

    const output = validateWord(attemptWord, wordToGuess);

    const expectedOutput = [
      { char: "s", isValidChar: true, isValidPosition: true },
      { char: "m", isValidChar: true, isValidPosition: true },
      { char: "l", isValidChar: true, isValidPosition: false },
      { char: "e", isValidChar: true, isValidPosition: false },
      { char: "d", isValidChar: false, isValidPosition: false },
    ];

    expect(output).toEqual(expectedOutput);
  });
});
