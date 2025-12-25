const express = require("express");
const jwt = require("jsonwebtoken");

//Middleware

const JwtMiddleare = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) return res.send("please login/signup");

  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.send("token not found");
  try {
    const Decoded_payload = jwt.verify(token, process.env.key);

    req.payloadData = Decoded_payload;
    next();
  } catch (err) {
    res.send("internal issues");
  }
};

//token creation;

const token = (payload) => {
  return jwt.sign(payload, process.env.key);
};

module.exports = { JwtMiddleare, token };
