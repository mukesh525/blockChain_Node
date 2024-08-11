const BaseJoi = require("joi");
const Extension = require("joi-date-extensions");
const Joi = BaseJoi.extend(Extension);

const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    tokenName: {
      type: String,
    },
    tokenAddress: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 50000,
    },
    tokenBuyPrice: {
      type: Number,
      required: true,
    },
    tokenBalance: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Transactions = mongoose.model("Transactions", TransactionSchema);

function validateTransaction(token) {
  const schema = {
    tokenName: Joi.string().min(1).max(50000).required(),
    tokenAddress: Joi.string().min(1).max(50000).required(),
    tokenBuyPrice: Joi.number().min(0).required(),
    tokenBalance: Joi.number().min(0).required(),
  };
  return Joi.validate(token, schema, { allowUnknown: true });
}

exports.Transactions = Transactions;
exports.validate = validateTransaction;
