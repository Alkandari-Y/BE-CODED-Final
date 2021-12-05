const { Schema, model } = require("mongoose");

const GroupSchema = Schema(
  {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        members: [
            {
            type: Schema.Types.ObjectId,
            ref: 'Profile'
            }
        ],
        polls: [{
            type: Schema.Types.ObjectId,
            ref: 'Polls'
            }
        ],
        chat: [{
            message: String,
            date: Date
            }
        ]
    },
  { timestamps: true }
);

module.exports = model("User", GroupSchema);
