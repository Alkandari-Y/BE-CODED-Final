const { Schema, model } = require("mongoose");

const MessageSchema = Schema(
  {
    message: String,
    sentFrom: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    contentType: {
        type: String,
        default: 'chat',
    }
  },
  { timestamps: true }
);

module.exports = model("Message", MessageSchema);
