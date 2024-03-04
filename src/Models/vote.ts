import { model, Schema } from "mongoose";

const VoteDB = model("vote", new Schema({
    userId: {
        type: String,
        required: true
    },
    voted: {
        type: Boolean,
        default: false
    },
    votes: {
        type: Number,
        default: 0
    }
}));

export { VoteDB }