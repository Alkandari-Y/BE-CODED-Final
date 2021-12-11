const e = require("express");
const Poll = require("../../db/models/Poll");

exports.fetchPollById = async (pollId, next) => {
  try {
    const poll = await Poll.findById(pollId);

    return poll;
  } catch (error) {
    next(error);
  }
};

exports.submitVote = async (req, res, next) => {
  try {
    const newVote = await Poll.findByIdAndUpdate(
      req.poll._id,
      {
        $push: { votes: req.body },
      },
      { new: true, runValidators: true }
    );
    // REVIEW: If you're not using newVote, no need to use findByIdAndUpdate, you can directly use the update function on req.poll

    let upVoteCount;

    if (req.body.vote === "yes") {
      upVoteCount = await Poll.findByIdAndUpdate(
        req.poll._id,
        { $inc: { yesVotes: 1 } },
        { new: true, runValidators: true }
      );
    } else if (req.body.vote === "no") {
      upVoteCount = await Poll.findByIdAndUpdate(
        req.poll._id,
        { $inc: { noVotes: 1 } },
        { new: true, runValidators: true }
      );
    }
    // REVIEW: You already have votes, why recalculate >:(
    // VIRTUAL FIELDS that calculate the up and down votes, wallah they're amazing
    return res.json(upVoteCount);
  } catch (error) {
    next(error);
  }
};
