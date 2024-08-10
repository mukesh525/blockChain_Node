const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { Token } = require("../models/token");
const kafkaProducer = require("../lib/kafka/producer");
const tokenRepository = require("../repositories/tokenRepository");

router.get("/", async (req, res) => {
  const tokenData = {
    tokenName: "Example Token",
    tokenAddress: "0x1234567890abcdef",
  };
  try {
    const newToken = await tokenRepository.createToken(tokenData);
    console.log("Token created:", newToken);
  } catch (error) {
    console.error("Failed to create token:", error);
  }
  return res.status(200).send({ message: "Hello" });
});

module.exports = router;
