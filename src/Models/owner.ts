import mongoose from "mongoose";

interface owner {
    userId: string,
    Cmds: string[],
    Category: string[]
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
    }
}));

export { OwnerDB }