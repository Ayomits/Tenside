import { Schema } from "mongoose";
import mongoose from "mongoose";
const userSchema = new Schema({
    guild_id: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    lvl: {
        type: Number,
        default: 0,
    },
    xp: {
        type: Number,
        default: 0,
    },
    reputation: {
        type: Number,
        default: 0,
    },
    voiceActive: {
        type: Number,
        default: 0
    },
    messageCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: "Статус не установлен.",
        maxLenght: 40
    }
});
const timelySchema = new Schema({
    guild_id: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },
});
const marrySchema = new Schema({
    guild_id: {
        type: String,
        required: true,
    },
    partner1_id: {
        type: String,
        required: true,
    },
    partner2_id: {
        type: String,
        required: true,
    },
    created_at: {
        type: String,
        required: true,
        default: Date.now(),
    },
    marry_points: {
        type: Number,
        default: 0,
        required: true,
    },
});
const workSchema = new Schema({
    guild_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    next_work: {
        type: Date,
        requred: true
    }
});
const TimelyModel = mongoose.model("UsersTimely", timelySchema);
const userModel = mongoose.model("user", userSchema);
const marryModel = mongoose.model("marrypoints", marrySchema);
const workModel = mongoose.model('work', workSchema);
export default {
    TimelyModel,
    userModel,
    marryModel,
    workModel
};
