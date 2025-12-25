const express = require("express");
const route = express.Router();

const User = require("../model/user");
const Candidate = require("../model/candidate");

const { JwtMiddleare, token } = require("../auth");

// signup
route.post("/signup", JwtMiddleare, async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();

    const payload = {
      mobile,
      password,
    };
    token(payload);

    res.status(201).json({ msg: "success" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// login
route.post("/login", JwtMiddleare, async (req, res) => {
  const { mobile, password } = req.body;

  const payload = {
    mobile,
    password,
  };
  token(payload);

  try {
    const user = await User.findOne({ mobile });
    if (!user) return res.send("user not found");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.send("wrong password");

    res.send({ msg: "success" });
  } catch (err) {
    res.status(500).send(err);
  }
});

// update password
route.put("/profile/password", JwtMiddleare, async (req, res) => {
  const { mobile } = req.payloadData;
  const { password } = req.body;

  try {
    const user = await User.findOne({ mobile });
    if (!user) return res.send("user not found");

    user.password = password;
    await user.save();

    res.send({ msg: "success" });
  } catch (err) {
    res.status(500).send("internal error");
  }
});

// get all candidates
route.get("/candidates", JwtMiddleare, async (req, res) => {
  try {
    const data = await Candidate.find();
    res.json(data);
  } catch (err) {
    res.status(500).send("internal error");
  }
});

module.exports = route;
