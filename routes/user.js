const express = require("express");
const router = express.Router();

const User = require("../model/user");
const Candidate = require("../model/candidate");

const { jwtMiddleware, generateToken } = require("../auth");

router.post("/signup", async (req, res) => {
  try {
    const { aadharCardNumber, role } = req.body;
    const existingUser = await User.findOne({ aadharCardNumber });
    if (existingUser) {
      return res.status(400).send("user already exist");
    }
    if (role === "admin") {
      const adminExists = await User.findOne({ role: "admin" });
      if (adminExists) {
        return res.status(403).send("already admin exist");
      }
    }

    const newUser = new User(req.body);
    await newUser.save();
    const payload = newUser.id;
    const token = generateToken(payload);

    res.status(201).json({
      msg: "success",
      token: token,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// login
router.post("/login", async (req, res) => {
  const { aadharCardNumber, password } = req.body;

  try {
    const user = await User.findOne({ aadharCardNumber: aadharCardNumber });
    if (!user) return res.send("user not found");

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) return res.send("wrong password");

    const tokenPayload = {
      id: user.id,
    };
    const token = generateToken(tokenPayload);

    res.status(201).json({ msg: "success", token: token });
  } catch (err) {
    res.status(500).send(err);
  }
});

// profile
router.get("/profile", jwtMiddleware, async (req, res) => {
  try {
    const userPayload = req.userPayload;
    const user = await User.findById(userPayload.id);
    res.send(user);
  } catch (err) {
    res.send("internal issues");
  }
});

// update password
router.put("/profile/password", jwtMiddleware, async (req, res) => {
  const userPayload = req.userPayload;
  const { currentpassword, newPassword } = req.body;

  const user = await User.findById(userPayload);

  const isPasswordValid = await user.comparePassword(currentpassword);
  if (!isPasswordValid) return res.send("wrong password");

  try {
    user.password = newPassword;
    await user.save();

    res.send({ msg: "success" });
  } catch (err) {
    res.status(500).send("internal error");
  }
});

// get all candidates
router.get("/candidates", jwtMiddleware, async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (err) {
    res.status(500).send("internal error");
  }
});

module.exports = router;
