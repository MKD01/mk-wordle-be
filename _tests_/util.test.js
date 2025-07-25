const { getDailyRandomNum } = require("../utils/util");

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
