const { Schema, model } = require("mongoose");

const GroupSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: [20, "Max length for group name is 20"],
    },
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
        ref: "Poll",
      },
    ],
    chat: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
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
