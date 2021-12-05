const express = require("express");
const router = express.Router();
const passport = require("passport");
const upload = require("../../middleware/multer");

// Controllers import
const {
  fetchGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
} = require("./controllers");

//Routers
router.param("groupId", async (req, res, next, groupId) => {
  const group = await fetchGroupById(groupId, next);
  if (group) {
    req.group = group;
    next();
  } else {
    next({ status: 404, message: "Groups not found" });
  }
});

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  createGroup
);

router.put(
  "/:groupId",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  updateGroup
);

router.delete(
  "/:groupId",
  passport.authenticate("jwt", { session: false }),
  deleteGroup
);

module.exports = router;
