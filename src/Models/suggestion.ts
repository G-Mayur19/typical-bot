import { model, Schema } from "mongoose";

const suggestionDB = model("suggestion", new Schema({
    userId: {
        type: String,
        required: true
    },
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
    },
    MsgID: {
        type: String,
        default: ""
    }
}));

export { suggestionDB }