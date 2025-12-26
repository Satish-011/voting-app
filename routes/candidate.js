const express = require("express");
const router = express.Router();

const Candidate = require("../model/candidate");
const User = require("../model/user");

const { jwtMiddleware } = require("../auth");
const user = require("../model/user");

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
router.delete("/:candidateId", jwtMiddleware, async (req, res) => {
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

//start voting
router.post("/vote/:candidateId", jwtMiddleware, async (req, res) => {
  try {
    const { id } = req.payloadData;

    const user = await User.findById(id);
    if (!user) return res.send("user not found");

    if (user.role === "admin") return res.send("you are admin can't vote");

    if (user.isVoted) return res.send("you can't vote multiple times");

    const user_voted_for = req.params.candidateId;
    if (!user_voted_for) return res.send("candidate not found");

    const candidate = await Candidate.findById(user_voted_for);
    if (!candidate) return res.send("candidate not found");

    candidate.votes.push({
      user: id,
    });

    candidate.voteCount += 1;

    user.isVoted = true;

    await candidate.save();
    await user.save();

    res.send("vote registered successfully");
  } catch (err) {
    res.status(500).send("internal error");
  }
});

//vote count
router.get("/vote/count", async (req, res) => {
  try {
    const users = await Candidate.find().sort({ voteCount: -1 });

    const result = users.map(u => ({
      name: u.name,
      party: u.party,
      voteCount: u.voteCount
    }));

    res.send(result);
  } catch (err) {
    res.status(500).send("internal error");
  }
});

// Get List of all candidates with only name and party fields
router.get("/", async (req, res) => {
  try {
    // Find all candidates and select only the name,party fieldsand votecount, excluding _id
    const candidates = await Candidate.find({}, "name party votecount -_id");

    // Return the list of candidates
    res.status(200).json(candidates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
