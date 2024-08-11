const mongoose = require("mongoose");
const TokensWatchSchema = new mongoose.Schema(
  {
    tokenAddress: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 50000,
    },
    id: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 50000,
    },
  },
  { timestamps: true, versionKey: false }
);

const WatchTokens = mongoose.model("WatchTokens", TokensWatchSchema);

exports.WatchTokens = WatchTokens;
