const request = require("supertest");
const app = require("../app");

describe("/api", () => {
  it("should respond with the endpoints json file", () => {
    const endpoints = require("../endpoints.json");

    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpoints);
      });
  });
});

describe("api/unknown/endpoint", () => {
  it("should respond with 404 page not found, for any invalid endpoint", () => {
    return request(app)
      .get("/api/unknown")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Page Not Found");
      });
  });
});

describe("/api/word", () => {
  describe("GET", () => {
    it("should return a random 5 letter word each time", () => {
      return request(app)
        .get("/api/word")
        .expect(200)
        .then(({ body }) => {
          expect(typeof body.word).toBe("string");
          expect(body.word.length).toBe(5);
        });
    });

    it("should respond with a different word each time", () => {
      const pendingWord1 = request(app).get("/api/word");
      const pendingWord2 = request(app).get("/api/word");

      return Promise.all([pendingWord1, pendingWord2]).then((responses) => {
        const word1 = responses[0].body.word;
        const word2 = responses[1].body.word;
        expect(word1).not.toBe(word2);
      });
    });
  });
});

describe("/api/word/daily", () => {
  describe("GET", () => {
    it("should respond with a 5 letter word", () => {
      return request(app)
        .get("/api/word/daily")
        .expect(200)
        .then(({ body }) => {
          expect(typeof body.word).toBe("string");
          expect(body.word.length).toBe(5);
        });
    });

    it("should respond with the same word each time (which is changes daily)", () => {
      const pendingWord1 = request(app).get("/api/word/daily");
      const pendingWord2 = request(app).get("/api/word/daily");

      return Promise.all([pendingWord1, pendingWord2]).then((responses) => {
        const word1 = responses[0].body.word;
        const word2 = responses[1].body.word;
        expect(word1).toBe(word2);
      });
    });
  });

  describe("POST", () => {
    beforeAll(() => {
      jest.useFakeTimers().setSystemTime(new Date("2025-01-01T00:00:00Z"));
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("should take a valid guessed word, and respond with which letters are correct but not in the right positions", () => {
      const postBody = { word: "glide" };

      return request(app)
        .post("/api/word/daily")
        .send(postBody)
        .expect(201)
        .then(({ body }) => {
          const expectedOutput = {
            letters: [
              { char: "g", isValidChar: false, isValidPosition: false },
              { char: "l", isValidChar: true, isValidPosition: false },
              { char: "i", isValidChar: false, isValidPosition: false },
              { char: "d", isValidChar: false, isValidPosition: false },
              { char: "e", isValidChar: true, isValidPosition: false },
            ],
          };

          expect(body.attempt).toEqual(expectedOutput);
        });
    });

    it("should correctly respond with the characters that are valid and in the right position with atleast one character that is not", () => {
      const postBody = { word: "spelt" };

      return request(app)
        .post("/api/word/daily")
        .send(postBody)
        .expect(201)
        .then(({ body }) => {
          const expectedOutput = {
            letters: [
              { char: "s", isValidChar: true, isValidPosition: true },
              { char: "p", isValidChar: false, isValidPosition: false },
              { char: "e", isValidChar: true, isValidPosition: true },
              { char: "l", isValidChar: true, isValidPosition: true },
              { char: "t", isValidChar: true, isValidPosition: true },
            ],
          };

          expect(body.attempt).toEqual(expectedOutput);
        });
    });

    it("should correctly respond with all characters being valid and in the correct positions when the guessed word is the correct word", () => {
      const postBody = { word: "smelt" };

      return request(app)
        .post("/api/word/daily")
        .send(postBody)
        .expect(201)
        .then(({ body }) => {
          const expectedOutput = {
            letters: [
              { char: "s", isValidChar: true, isValidPosition: true },
              { char: "m", isValidChar: true, isValidPosition: true },
              { char: "e", isValidChar: true, isValidPosition: true },
              { char: "l", isValidChar: true, isValidPosition: true },
              { char: "t", isValidChar: true, isValidPosition: true },
            ],
          };

          expect(body.attempt).toEqual(expectedOutput);
        });
    });

    it("should respond with a 400 error when given an invalid word that is greater than 5 characters", () => {
      const postBody = { word: "smelts" };

      return request(app)
        .post("/api/word/daily")
        .send(postBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.err).toBe("Invalid word length");
        });
    });

    it("should respond with a 400 error when given an empty string", () => {
      const postBody = { word: "" };

      return request(app)
        .post("/api/word/daily")
        .send(postBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.err).toBe("Invalid word length");
        });
    });

    it("should respond with a 400 error when given an invalid value for the word", () => {
      const postBody = { word: 3 };

      return request(app)
        .post("/api/word/daily")
        .send(postBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.err).toBe("Invalid word");
        });
    });

    it("should respond with a 400 when no word is given", () => {
      const postBody = {};

      return request(app)
        .post("/api/word/daily")
        .send(postBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.err).toBe("Invalid word");
        });
    });
  });
});
