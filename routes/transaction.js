const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { validate } = require("../models/transaction");

const transactionRepository = require("../repositories/transactionRepository");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send({ message: error.details[0].message.replace(/['"]+/g, "") });

  const tokenData = req.body;
  try {
    const newToken = await transactionRepository.createTransaction(tokenData);
    console.log("Token created:", newToken);
    return res.status(200).send(newToken);
  } catch (error) {
    console.error("Failed to create token:", error);
    return res.status(400).send(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const allTransaction = await transactionRepository.findAllTransactions();
    return res.status(200).send(allTransaction);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

module.exports = router;
