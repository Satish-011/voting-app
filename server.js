const express = require("express");
const app = express();

require("dotenv").config();

// DB
const dbConnection = require("./db");

// Middleware
app.use(express.json());

// Routess
const userRoutes = require("./routes/user");
const candidateRoutes = require("./routes/candidate");

app.use("/user", userRoutes);
app.use("/candidate", candidateRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("server started!!");
});
