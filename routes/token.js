const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { Token, validate } = require("../models/token");
const kafkaProducer = require("../lib/kafka/producer");
const tokenRepository = require("../repositories/tokenRepository");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send({ message: error.details[0].message.replace(/['"]+/g, "") });

  const tokenData = req.body;
  try {
    const newToken = await tokenRepository.createToken(tokenData);
    console.log("Token created:", newToken);
  } catch (error) {
    console.error("Failed to create token:", error);
  }
  return res.status(200).send({ message: "Hello" });
});

module.exports = router;
