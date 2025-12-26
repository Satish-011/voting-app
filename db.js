const mongoose = require("mongoose");
require("dotenv").config();

//local
const mongoUrl = process.env.DB_URL_local;

mongoose.connect(mongoUrl);

const dbConnection = mongoose.connection;

dbConnection.on("connected", () => {
  console.log("MongoDB connected successfully");
});

dbConnection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

dbConnection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

module.exports = dbConnection;
