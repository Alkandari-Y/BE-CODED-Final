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

    return res.json(upVoteCount);
  } catch (error) {
    next(error);
  }
};
