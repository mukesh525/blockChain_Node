const BaseJoi = require("joi");
const Extension = require("joi-date-extensions");
const Joi = BaseJoi.extend(Extension);

const mongoose = require("mongoose");
const kafkaProducer = require("../lib/kafka/producer");

const TokensSchema = new mongoose.Schema(
  {
    tokenName: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 50000,
    },
    tokenAddress: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 50000,
    },
  },
  { timestamps: true, versionKey: false }
);

// Post-save middleware to log new documents
TokensSchema.post("save", function (doc) {
  kafkaProducer.sendMessage("test-topic", { tokenAddress: doc.tokenAddress });
  console.log(`New document saved: ${JSON.stringify(doc)}`);
});

const Tokens = mongoose.model("Tokens", TokensSchema);

function validateToken(token) {
  const schema = {
    tokenName: Joi.string().min(1).max(50000).required(),
    tokenAddress: Joi.string().min(1).max(50000).required(),
  };
  return Joi.validate(token, schema, { allowUnknown: true });
}

exports.Token = Tokens;
exports.validate = validateToken;
