const mongoose = require("mongoose");

const config = require("../config");

const db = config.DB_URI;

module.exports = function () {
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      autoIndex: false, // Don't build indexes
      family: 4, // Use IPv4, skip trying IPv6
      connectTimeoutMS: 10000, // Timeout for establishing a connection (10 seconds)
      socketTimeoutMS: 45000, // Timeout for socket inactivity (45 seconds)
      serverSelectionTimeoutMS: 5000, // Timeout for server selection (5 seconds)
    })
    .then(() => {
      console.log(`Connected to ${db} at ${new Date().toISOString()}...`);
    })
    .catch((error) => {
      if (error.name === "MongoServerSelectionError") {
        console.error(
          `MongoDB server selection timed out after ${error.serverSelectionTimeoutMS} ms at`,
          new Date().toISOString(),
          ":",
          error.message
        );
      } else {
        console.error(
          "MongoDB connection error at",
          new Date().toISOString(),
          ":",
          error
        );
      }
    });

  mongoose.connection.on("disconnected", () => {
    lastDisconnectedAt = new Date(); // Record the disconnection time
    console.log(
      "MongoDB connection disconnected at",
      lastDisconnectedAt.toISOString()
    );
  });

  mongoose.connection.on("reconnected", () => {
    if (lastDisconnectedAt) {
      const now = new Date();
      const duration = now - lastDisconnectedAt; // Duration in milliseconds
      const seconds = (duration / 1000).toFixed(2); // Convert to seconds
      console.log("MongoDB connection reconnected at", now.toISOString());
      console.log(`Connection was down for ${seconds} seconds`);
      lastDisconnectedAt = null; // Reset disconnection timestamp
    }
  });

  mongoose.connection.on("error", (err) => {
    if (err.name === "MongoServerSelectionError") {
      console.error(
        `MongoDB server selection timed out after ${err.serverSelectionTimeoutMS} ms at`,
        new Date().toISOString(),
        ":",
        err.message
      );
    } else {
      console.error(
        "MongoDB connection error at",
        new Date().toISOString(),
        ":",
        err
      );
    }
  });
};
