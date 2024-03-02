import { model, Schema, Types } from "mongoose";

interface Level {
    userId: string,
    XP: number,
    Level: number
}

const LevelDB = model<Level>("Level", new Schema({
    userId: {
        type: String,
        required: true
    },
    XP: {
        type: Number,
        default: 0
    },
    Level: {
        type: Number,
        default: 1
    }
}));

export { LevelDB }