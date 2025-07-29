const express = require("express");
const { getEndpoints } = require("./controllers/api.controller");
const {
  customErrorHandler,
  serverErrorHandler,
  invalidPathHandler,
} = require("./middleware/errors");

const apiRouter = require("./router/api.router");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.use(invalidPathHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
