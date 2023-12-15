"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.casinoModel = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
const casinoSchema = new mongoose_1.Schema({
    guild_id: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 500000,
    },
});
exports.casinoModel = mongoose_2.default.model("casino", casinoSchema);
