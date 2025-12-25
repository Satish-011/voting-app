const express = require("express");
const route = express.Router();

const Candidate = require("../model/candidate");
const User = require("../model/user");

const { JwtMiddleare, token } = require("../auth");

// admin check
const checkAdminRole = async (userID) => {
  try {
    const user = await User.findById(userID);
    return user && user.role === "admin";
  } catch {
    return false;
  }
};

// create candidate
route.post("/candidates",JwtMiddleare, async (req, res) => {
  const { userID } = req.body;

  if (!(await checkAdminRole(userID)))
    return res.status(403).json({ message: "not admin" });

  try {
    const newCandidate = new Candidate(req.body);
    await newCandidate.save();
    const payload={
      
    }
    res.status(201).json({ msg: "success" });
  } catch (err) {
    res.status(500).send("internal error");
  }
});

// update candidate
route.put("/candidates/:candidateID", async (req, res) => {
  const { userID } = req.body;

  if (!(await checkAdminRole(userID)))
    return res.status(403).json({ message: "not admin" });

  try {
    const response = await Candidate.findByIdAndUpdate(
      req.params.candidateID,
      req.body,
      { new: true, runValidators: true }
    );

    if (!response) return res.status(404).json({ msg: "not found" });

    res.json(response);
  } catch (err) {
    res.status(500).send("internal error");
  }
});

// delete candidate
route.delete("/candidates/:candidateID", async (req, res) => {
  const { userID } = req.body;

  if (!(await checkAdminRole(userID)))
    return res.status(403).json({ message: "not admin" });

  try {
    const response = await Candidate.findByIdAndDelete(
      req.params.candidateID
    );

    if (!response) return res.status(404).json({ msg: "not found" });

    res.json({ msg: "deleted" });
  } catch (err) {
    res.status(500).send("internal error");
  }
});

module.exports = route;
