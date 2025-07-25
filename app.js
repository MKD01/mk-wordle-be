const express = require("express");
const { getEndpoints } = require("./models/api.model");

const app = express();

app.get("/api", getEndpoints);

module.exports = app;
