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
  describe("GET /id", () => {
    it("should respond with an array of random word id's, defaulting to a single id in the array", () => {
      return request(app)
        .get("/api/word/ids")
        .expect(200)
        .then(({ body }) => {
          expect(body.wordIds.length).toBe(1);
          expect(typeof body.wordIds[0]).toBe("number");
        });
    });

    it("should respond with two different word id's when given a quantity (q) query of 2", () => {
      return request(app)
        .get("/api/word/ids?q=2")
        .then(({ body }) => {
          expect(body.wordIds.length).toBe(2);

          body.wordIds.forEach((wordId) => {
            expect(typeof wordId).toBe("number");
          });

          expect(body.wordIds[0]).not.toBe(body.wordIds[1]);
        });
    });

    it("should respond with a maximum of 10 unique word id's when given a quantity (q) query of 10 or greater", () => {
      return request(app)
        .get("/api/word/ids?q=15")
        .then(({ body }) => {
          expect(body.wordIds.length).toBe(10);

          const wordIdLookup = {};

          body.wordIds.forEach((wordId) => {
            if (wordIdLookup[wordId]) {
              wordIdLookup[wordId]++;
            } else {
              wordIdLookup[wordId] = 1;
            }
          });

          Object.keys(wordIdLookup).forEach((wordId) => {
            expect(wordIdLookup[wordId]).toBe(1);
          });
        });
    });

    it("should respond with a 400 error message when the quantity (q) query is an invalid value", () => {
      return request(app)
        .get("/api/word/ids?q=banana")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });

  describe("POST /:wordId", () => {
    it("should take a valid word and a word id, and respond with if any letters are correct/in the right positions", () => {
      const postBody = { word: "glide" };

      return request(app)
        .post("/api/word/123")
        .send(postBody)
        .expect(201)
        .then(({ body }) => {
          const expectedOutput = {
            letters: [
              { char: "g", isValidChar: false, isValidPosition: false },
              { char: "l", isValidChar: false, isValidPosition: false },
              { char: "i", isValidChar: false, isValidPosition: false },
              { char: "d", isValidChar: false, isValidPosition: false },
              { char: "e", isValidChar: true, isValidPosition: false },
            ],
          };

          expect(body.attempt).toEqual(expectedOutput);
        });
    });

    it("when give the matching word to the word id given, the response should show all matching letters", () => {
      const postBody = { word: "heavy" };

      return request(app)
        .post("/api/word/123")
        .send(postBody)
        .expect(201)
        .then(({ body }) => {
          const expectedOutput = {
            letters: [
              { char: "h", isValidChar: true, isValidPosition: true },
              { char: "e", isValidChar: true, isValidPosition: true },
              { char: "a", isValidChar: true, isValidPosition: true },
              { char: "v", isValidChar: true, isValidPosition: true },
              { char: "y", isValidChar: true, isValidPosition: true },
            ],
          };

          expect(body.attempt).toEqual(expectedOutput);
        });
    });

    it("should respond with a 404 for a wordId that is valid but does not exist", () => {
      const postBody = { word: "heavy" };

      return request(app)
        .post("/api/word/999999")
        .send(postBody)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("wordId not found");
        });
    });

    it("should respond with a 400 for a wordId that is invalid", () => {
      const postBody = { word: "heavy" };

      return request(app)
        .post("/api/word/banana")
        .send(postBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("wordId not valid");
        });
    });

    it("should respond with a 400 when given a word that is not 5 letters", () => {
      const postBody = { word: "heavyy" };

      return request(app)
        .post("/api/word/123")
        .send(postBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("Invalid word length");
        });
    });

    it("should respond with a 400 when given an invalid word", () => {
      const postBody = { word: 23 };

      return request(app)
        .post("/api/word/123")
        .send(postBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("Invalid word");
        });
    });

    it("should respond with a 400 when wors is not provided", () => {
      const postBody = {};

      return request(app)
        .post("/api/word/123")
        .send(postBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("Invalid word");
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
          expect(body.msg).toBe("Invalid word length");
        });
    });

    it("should respond with a 400 error when given an empty string", () => {
      const postBody = { word: "" };

      return request(app)
        .post("/api/word/daily")
        .send(postBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid word length");
        });
    });

    it("should respond with a 400 error when given an invalid value for the word", () => {
      const postBody = { word: 3 };

      return request(app)
        .post("/api/word/daily")
        .send(postBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid word");
        });
    });

    it("should respond with a 400 when no word is given", () => {
      const postBody = {};

      return request(app)
        .post("/api/word/daily")
        .send(postBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid word");
        });
    });
  });
});
