const mongoose = require("mongoose");

//dot env file
require("dotenv").config();

const mongoURL = process.env.DB_URL_local;

mongoose.connect(mongoURL);

const db = mongoose.connection;

// define event listeners for database connection

// when mongodb is connected
db.on("connected", () => {
  console.log("MongoDB connected successfully");
});

// when there is any connection error
db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// when mongodb server is stopped / disconnected
db.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

// export the database connection
module.exports = db;
