const express = require("express");
const router = express.Router();
const passport = require("passport");
const { fetchPollById, submitVote } = require("./controllers");

router.param("pollId", async (req, res, next, pollId) => {
  const poll = await fetchPollById(pollId, next);
  if (poll) {
    req.poll = poll;
    next();
  } else {
    next({ status: 404, message: "Poll not found" });
  }
});

router.put(
  "/:pollId/submitvote",
  passport.authenticate("jwt", { session: false }),
  submitVote
);

module.exports = router;
