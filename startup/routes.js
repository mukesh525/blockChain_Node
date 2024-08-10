const express = require("express");
const Token = require("../routes/token");
const error = require("../middleware/error");
var bodyParser = require("body-parser");

module.exports = function (app) {
  app.use(bodyParser.json({ limit: "50mb", extended: true }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  app.use("/api/token", Token);
  app.use(error);
};
