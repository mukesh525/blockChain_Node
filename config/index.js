if (process.env.NODE_ENV === "production") {
  console.log(process.env.NODE_ENV);
  module.exports = require("./prod");
} else {
  module.exports = require("./dev");
}
