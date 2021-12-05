const { Schema, model } = require("mongoose");

const ProfileSchema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      default: 'New User'
    },
    image: {
      type: String,
      default: "/media/defaultUserImage.jpg",
    },
    status: {
      type: String,
    },
    groups: [{ type: Schema.Types.ObjectId, ref: "Groups" }],
  },
  { timestamps: true }
);

module.exports = model("Profile", ProfileSchema);
