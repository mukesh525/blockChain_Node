const _ = require("lodash");
const express = require("express");
const router = express.Router();

const transactionRepository = require("../repositories/WatchtokenRepository");

router.get("/", async (req, res) => {
  try {
    const allTransaction = await transactionRepository.findAllWatchTokens();
    return res.status(200).send(allTransaction);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

module.exports = router;
