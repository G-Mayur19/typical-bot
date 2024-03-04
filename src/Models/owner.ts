import mongoose from "mongoose";

interface owner {
    userId: string,
    Cmds: string[],
    Category: string[],
    Voting: boolean
}

const OwnerDB = mongoose.model<owner>("Owner", new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    Cmds: {
        type: [],
        default: []
    },
    Category: {
        type: [],
        default: []
    },
    Voting: {
        type: Boolean,
        default: false
    }
}), "owner");

export { OwnerDB }