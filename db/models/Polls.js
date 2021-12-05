const { Schema, model } = require("mongoose");

const PollSchema = Schema(
    {
        title: {
            types: String,
            require: true
        },
        image: {
            type: String,
            require: true
        },
        votes: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'User'
                },
                vote: {
                    type: String,
                    enum: {
                        values: ['yes', 'not'],
                    }
                }
            }
        ],
        yesVotes: Number,
        noVotes: Number,
        expiration: {
            type: Date,
            required: true,
        }
    }   
)

module.exports = model("Poll", PollSchema);
