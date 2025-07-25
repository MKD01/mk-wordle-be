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

describe("/api/word/daily", () => {
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

describe("/api/word", () => {
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
