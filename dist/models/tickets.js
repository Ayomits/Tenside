"use strict";
const mongoose = require('mongoose');
const { Schema } = mongoose;
const ticketSettingsSchema = new Schema({
    guild_id: {
        type: String,
        unique: true
    },
    channel_id: {
        type: String,
        unique: true
    }
});
const ticketLogSettingsSchema = new Schema({
    guild_id: {
        type: String,
        unique: true
    },
    channel_id: {
        type: String,
        unique: true
    }
});
const currentTicketSchema = new Schema({
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
const ticketSettingsEmbedSchema = new Schema({
    guild_id: {
        type: String,
        unique: true,
        default: 0
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
const ticketSettingsThemeSchema = new Schema({
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
const ticketCategorySchema = new Schema({
    guild_id: {
        type: String,
        unique: true
    },
    category_id: {
        type: String,
        unique: true
    }
});
const TicketSettingsTheme = mongoose.model("TicketSettingsTheme", ticketSettingsThemeSchema);
const TicketSettings = mongoose.model('TicketSettings', ticketSettingsSchema);
const TicketLogSettings = mongoose.model('TicketLogSettings', ticketLogSettingsSchema);
const CurrentTicket = mongoose.model('CurrentTicket', currentTicketSchema);
const TicketSettingsEmbed = mongoose.model('TicketSettingsEmbed', ticketSettingsEmbedSchema);
const TicketCategory = mongoose.model("TicketCategory", ticketCategorySchema);
module.exports = {
    TicketSettings,
    TicketLogSettings,
    CurrentTicket,
    TicketSettingsEmbed,
    TicketSettingsTheme,
    TicketCategory
};
