"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workModel = exports.marryModel = exports.userModel = exports.TimelyModel = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
const userSchema = new mongoose_1.Schema({
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
const timelySchema = new mongoose_1.Schema({
    guild_id: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },
});
const marrySchema = new mongoose_1.Schema({
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
        default: String(Date.now()),
    },
    marry_points: {
        type: Number,
        default: 0,
        required: true,
    },
});
const workSchema = new mongoose_1.Schema({
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
        required: true
    }
});
exports.TimelyModel = mongoose_2.default.model("UsersTimely", timelySchema);
exports.userModel = mongoose_2.default.model("user", userSchema);
exports.marryModel = mongoose_2.default.model("marrypoints", marrySchema);
exports.workModel = mongoose_2.default.model('work', workSchema);
exports.default = {
    TimelyModel: exports.TimelyModel,
    userModel: exports.userModel,
    marryModel: exports.marryModel,
    workModel: exports.workModel
};
