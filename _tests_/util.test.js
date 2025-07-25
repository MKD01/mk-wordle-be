const { getDailyRandomNum, getRandomNum } = require("../utils/util");

beforeAll(() => {
  jest.useFakeTimers().setSystemTime(new Date("2025-01-01T00:00:00Z"));
});

afterAll(() => {
  jest.useRealTimers();
});

describe("getDailyRandomNum", () => {
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
  });
});

describe("getRandomNum", () => {
  it("should return a number", () => {
    const num = getRandomNum();

    expect(typeof num).toBe("number");
  });

  it("should return a return a different number on each invocation", () => {
    const num1 = getRandomNum();
    const num2 = getRandomNum();

    expect(num1).not.toBe(num2);
  });

  it("can take an argument to determine how high the random number can be", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.42);

    const num1 = getRandomNum(10);
    expect(num1).toBe(4);

    const num2 = getRandomNum(100);
    expect(num2).toBe(42);

    Math.random.mockRestore();
  });
});
