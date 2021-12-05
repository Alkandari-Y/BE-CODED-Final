const { Schema, model, Types } = require("mongoose");

const UserSchema = Schema(
  {
    phoneNumber: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile: {
      type: Schema.Types.ObjectId,
      ref: 'Profile'
    },
  },
  { timestamps: true }
);

module.exports = model("User", UserSchema);
