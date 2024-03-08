import { model, Schema } from "mongoose";

const suggestionDB = model("suggestion", new Schema({
    userId: String,
    UpVotes: {
        type: Number,
        default: 0
    },
    DownVotes: {
        type: Number,
        default: 0
    },
    Voters: {
        type: Array,
        default: []
    },
    Type: {
        type: String,
        required: true
    }
}));

export { suggestionDB }