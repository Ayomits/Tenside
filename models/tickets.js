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
    unique: true
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
  theme_uniq_id:{
    type: String,
    unique: true
  },
  pinged_roles: {
    type: String
  }
})

const TicketSettingsTheme = mongoose.model("TicketSettingsTheme", ticketSettingsThemeSchema)
const TicketSettings = mongoose.model('TicketSettings', ticketSettingsSchema);
const TicketLogSettings = mongoose.model('TicketLogSettings', ticketLogSettingsSchema);
const CurrentTicket = mongoose.model('CurrentTicket', currentTicketSchema);
const TicketSettingsEmbed = mongoose.model('TicketSettingsEmbed', ticketSettingsEmbedSchema);

module.exports = {
  TicketSettings,
  TicketLogSettings,
  CurrentTicket,
  TicketSettingsEmbed,
  TicketSettingsTheme,
}