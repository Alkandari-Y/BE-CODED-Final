const express = require("express");
const {
  register,
  login,
  // updateProfile,
  getProfileList,
} = require("./controllers");
const upload = require('../../middleware/multer')
const router = express.Router();
const passport = require("passport");

router.post("/register", register);

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  login
);

// Updating Page
// router.put(
//   "/updateprofile",
//   passport.authenticate("jwt", { session: false }),
//   upload.single("image"),
//   updateProfile
// );

router.get(
  "/getprofiles",
  passport.authenticate("jwt", { session: false }),
  getProfileList);

module.exports = router;
