const express = require("express");
const app = express();

//dotenv file
require("dotenv").config();

//db connection
const database = require("./db");

//middleware
app.use(express.json());

//routes
const routes = require("./routes/user");
const route = require("./routes/candidate");
//use the routes
app.use("/", routes);
app.use("/", route);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("server started!!");
});
