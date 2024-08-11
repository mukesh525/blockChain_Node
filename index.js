const express = require("express");
const app = express();
const agenda = require("./lib/agenda");

const Consumer = require("./lib/kafka/consumer");
require("./startup/routes")(app);
require("./startup/db")();

async function graceful() {
  try {
    await agenda.stop(); // Ensure Agenda stops processing jobs
    console.log("Agenda stopped gracefully.");
    // Clear all jobs from the database
    await agenda.cancel({}); // Clear all jobs
    console.log("All jobs cleared from Agenda.");
  } catch (error) {
    console.error("Error stopping Agenda:", error);
  }

  // Close the Kafka consumer
  Consumer.close(true, () => {
    console.log("Kafka Consumer closed.");
    process.exit(0);
  });
  process.exit(0);
}

process.on("SIGTERM", graceful);
process.on("SIGINT", graceful);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Listening process id ${process.pid} on port ${port}`);
});

module.exports = server;
