const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { validate } = require("../models/token");
const { GetQuote, BuyOrSell } = require("../utils/price");
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
    return res.status(200).send(newToken);
  } catch (error) {
    console.error("Failed to create token:", error);
    return res.status(400).send({ message: error });
  }
});

router.get("/", async (req, res) => {
  try {
    const allTokens = await tokenRepository.findAllToken();
    return res.status(200).send(allTokens);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

router.post("/BuyOrSell", async (req, res) => {
  try {
    console.log(req.body);
    let { tokenAddress, solanAddress } = req.body;
    const data = await BuyOrSell(tokenAddress, solanAddress);
    console.log("BuyOrSell data:", data);
    return res.status(200).send(newToken);
  } catch (error) {
    console.error("Failed to create token:", error);
    return res.status(400).send({ message: error });
  }
});

module.exports = router;
