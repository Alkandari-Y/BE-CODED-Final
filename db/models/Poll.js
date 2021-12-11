const { Schema, model } = require("mongoose");

const PollSchema = Schema(
  {
    title: {
      type: String,
      required: true,
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
            // REVIEW: If it's just yes or no, why not boolean? or maybe add ممتنع عن التصويت
            values: ["yes", "no"],
          },
        },
      },
    ],
    // REVIEW: Since you have the votes field, and those two fields are actually calculated from them, the correct approach is for them to be virtual fields 3shan they  don't be saved into the db
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
