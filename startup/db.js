const mongoose = require("mongoose");

const config = require("../config");

const db = config.DB_URI;

module.exports = function () {
  //const db = config.DB_URI;
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      autoIndex: false, // Don't build indexes
      poolSize: 7, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    })
    .then(() => {
      this.db = db;
      console.log(`Connected to ${db}...`);
    })
    .catch((e) => console.log(e));
};
