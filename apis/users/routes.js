const express = require("express");
const { register, login } = require("./controllers");
const router = express.Router();
const passport = require("passport");

router.post("/register", register);

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  login
);

module.exports = router;
