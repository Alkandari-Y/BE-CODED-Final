const { Schema, model } = require("mongoose");

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
    SMSToken: String,
    isValidated: {
      type: Boolean,
      default: false
    },
    profile: {
      name: {
        type: String,
        default: 'New User',
        required: true,
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
  },
  { timestamps: true }
);

module.exports = model("User", UserSchema);