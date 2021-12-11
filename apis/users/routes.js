const express = require("express");
const {
  register,
  login,
  twilioVerificationCode,
  updateProfile,
  getProfileList,
} = require("./controllers");
const upload = require("../../middleware/multer");
const router = express.Router();
const passport = require("passport");

router.post("/register", register);

router.post(
  "/verifyTwilio",
  passport.authenticate("jwt", { session: false }),
  twilioVerificationCode
);

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  login
);

// REVIEW: bad naming, we dont put verbs in path names
// should be /profiles
router.put(
  "/updateprofile",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  updateProfile
);

// REVIEW: path should /profiles
router.get("/getprofiles", getProfileList);

module.exports = router;
