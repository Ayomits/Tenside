"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketCategory = exports.TicketSettingsEmbed = exports.CurrentTicket = exports.TicketLogSettings = exports.TicketSettings = exports.TicketSettingsTheme = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
const ticketSettingsSchema = new mongoose_1.Schema({
    guild_id: {
        type: String,
        unique: true
    },
    channel_id: {
        type: String,
        unique: true
    }
});
const ticketLogSettingsSchema = new mongoose_1.Schema({
    guild_id: {
        type: String,
        unique: true
    },
    channel_id: {
        type: String,
        unique: true
    }
});
const currentTicketSchema = new mongoose_1.Schema({
    guild_id: {
        type: String,
    },
    channel_id: {
        type: String,
        unique: true
    },
    ticket_creator_id: {
        type: String
    }
});
const ticketSettingsEmbedSchema = new mongoose_1.Schema({
    guild_id: {
        type: String,
        unique: true,
        default: "0"
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    color: {
        type: String,
        default: ""
    },
    imageLink: {
        type: String
    }
});
const ticketSettingsThemeSchema = new mongoose_1.Schema({
    guild_id: {
        type: String,
    },
    theme_title: {
        type: String,
        unique: true
    },
    theme_desc: {
        type: String
    },
    theme_uniq_id: {
        type: String,
        unique: true
    },
    pinged_roles: {
        type: String
    }
});
const ticketCategorySchema = new mongoose_1.Schema({
    guild_id: {
        type: String,
        unique: true
    },
    category_id: {
        type: String,
        unique: true
    }
});
exports.TicketSettingsTheme = mongoose_2.default.model("TicketSettingsTheme", ticketSettingsThemeSchema);
exports.TicketSettings = mongoose_2.default.model('TicketSettings', ticketSettingsSchema);
exports.TicketLogSettings = mongoose_2.default.model('TicketLogSettings', ticketLogSettingsSchema);
exports.CurrentTicket = mongoose_2.default.model('CurrentTicket', currentTicketSchema);
exports.TicketSettingsEmbed = mongoose_2.default.model('TicketSettingsEmbed', ticketSettingsEmbedSchema);
exports.TicketCategory = mongoose_2.default.model("TicketCategory", ticketCategorySchema);
