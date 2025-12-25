const express = require("express");
const router = express.Router();

const Candidate = require("../model/candidate");
const User = require("../model/user");

const { jwtMiddleware } = require("../auth");

// admin check
const isAdminUser = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return false;
    return user.role === "admin";
  } catch {
    return false;
  }
};

// create candidate
router.post("/signup", jwtMiddleware, async (req, res) => {
  const { id: userId } = req.userPayload;

  if (!(await isAdminUser(userId)))
    return res.status(403).json({ message: "not admin" });

  try {
    const newCandidate = new Candidate(req.body);
    await newCandidate.save();
    res.status(201).json({ msg: "success" });
  } catch (err) {
    res.status(500).send("internal error");
  }
});

// update candidate
router.put("/:candidateId", jwtMiddleware, async (req, res) => {
  const { id: userId } = req.userPayload;

  if (!(await isAdminUser(userId)))
    return res.status(403).json({ message: "not admin" });

  try {
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      req.params.candidateId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCandidate) return res.status(404).json({ msg: "not found" });

    res.json(updatedCandidate);
  } catch (err) {
    res.status(500).send("internal error");
  }
});

// delete candidate
router.delete("/:candidateId", async (req, res) => {
  const { id: userId } = req.userPayload;

  if (!(await isAdminUser(userId)))
    return res.status(403).json({ message: "not admin" });

  try {
    const deletedCandidate = await Candidate.findByIdAndDelete(
      req.params.candidateId
    );

    if (!deletedCandidate) return res.status(404).json({ msg: "not found" });

    res.json({ msg: "deleted" });
  } catch (err) {
    res.status(500).send("internal error");
  }
});

module.exports = router;
