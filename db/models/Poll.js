const { Schema, model } = require("mongoose");

const PollSchema = Schema(
  {
    title: {
      type: String,
      required: true,
    },
    overview: {
      type: String,
    },
    vote_average: {
      type: String,
    },
    release_date: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
    image: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      default: "poll",
    },
    votes: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        vote: {
          type: String,
          enum: {
            values: ["yes", "no"],
          },
        },
      },
    ],
    yesVotes: Number,
    noVotes: Number,
    expiration: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Poll", PollSchema);
