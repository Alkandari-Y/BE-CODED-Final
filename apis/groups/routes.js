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
  fetchUserGroups,
  addMembersToGroup,
  addMoviePoll,
  addChat
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

router.get("/", fetchUserGroups);

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

router.put(
  "/:groupId/members",
  passport.authenticate("jwt", { session: false }),
  addMembersToGroup
);

router.post(
  "/:groupId/createmoviepoll",
  passport.authenticate("jwt", { session: false }),
  addMoviePoll
);

router.post(
  "/:groupId/addChat",
  passport.authenticate("jwt", { session: false }),
  addChat
)

module.exports = router;
