const express = require("express");
const router = express.Router();
const upload = require("../../middleware/multer");
const passport = require("passport");

const {
  getProfileList,
  findUserProfileById,
  updateProfile,
  returnNewUserProfile,
} = require("./controllers");

router.param("profileId", async (req, res, next, profileId) => {
  const profile = await findUserProfileById(profileId, next);
  if (profile) {
    req.profile = profile;
    next();
  } else {
    next({ status: 404, message: "Profile Not Found!" });
  }
});

//Updating Page
router.put(
  "/:profileId",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  updateProfile
);

router.get(
  "/newUser",
  passport.authenticate("jwt", { session: false }),
  returnNewUserProfile
);

router.get("/", getProfileList);

module.exports = router;
