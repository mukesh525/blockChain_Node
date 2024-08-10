const express = require("express");
const app = express();
const agenda = require("./lib/agenda");

require("./startup/routes")(app);
require("./startup/db")();

async function graceful() {
  await agenda.stop();
  process.exit(0);
}

process.on("SIGTERM", graceful);
process.on("SIGINT", graceful);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listening process id ${process.pid} on port ${port}`);
});

module.exports = server;
