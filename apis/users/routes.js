const express = require("express");
const {
  register,
  login,
  twilioVerificationCode,
  updateProfile,
  getProfileList,
  returnNewUserProfile,
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

router.put(
  "/profiles",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  updateProfile
);

router.get("/profiles", getProfileList);

router.get(
  "/newprofile",
  passport.authenticate("jwt", { session: false }),
  returnNewUserProfile
);

module.exports = router;
