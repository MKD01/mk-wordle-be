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
  it("should respond with a 5 letter daily word", () => {
    return request(app)
      .get("/api/word/daily")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.word).toBe("string");
        expect(body.word.length).toBe(5);
      });
  });
});
