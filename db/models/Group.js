const { Schema, model } = require("mongoose");

const GroupSchema = Schema(
  {
    name: { type: String, required: true },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    polls: [
      {
        type: Schema.Types.ObjectId,
        ref: "Polls",
      },
    ],
    chat: [
      {
        message: String,
        date: Date,
      },
    ],
    image: {
      type: String,
      default: "/media/defaultUserImage.jpg",
    },
  },
  { timestamps: true }
);

module.exports = model("Group", GroupSchema);
