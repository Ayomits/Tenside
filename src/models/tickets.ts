import { Schema, Document } from "mongoose";
import mongoose from "mongoose";

// Интерфейс для схемы ticketSettingsSchema
export interface TicketSettingsInterface extends Document {
  guild_id: string;
  channel_id: string;
}

// Интерфейс для схемы ticketLogSettingsSchema
export interface TicketLogSettingsInterface extends Document {
  guild_id: string;
  channel_id: string;
}

// Интерфейс для схемы currentTicketSchema
export interface CurrentTicketInterface extends Document {
  guild_id: string;
  channel_id: string;
  ticket_creator_id: string;
}

// Интерфейс для схемы ticketSettingsEmbedSchema
export interface TicketSettingsEmbedInterface extends Document {
  guild_id: string;
  title: string;
  description: string;
  color: string;
  imageLink: string;
}

// Интерфейс для схемы ticketSettingsThemeSchema
export interface TicketSettingsThemeInterface extends Document {
  guild_id: string;
  theme_title: string;
  theme_desc: string;
  theme_uniq_id: string;
  pinged_roles: string;
}

// Интерфейс для схемы ticketCategorySchema
export interface TicketCategoryInterface extends Document {
  guild_id: string;
  category_id: string;
}

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

const ticketLogSettingsSchema = new Schema<TicketLogSettingsInterface>({
  guild_id: {
    type: String,
    unique: true
  },
  channel_id: {
    type: String,
    unique: true
  }
});

const currentTicketSchema = new Schema<CurrentTicketInterface>({
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

const ticketSettingsEmbedSchema = new Schema<TicketSettingsEmbedInterface>({
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

const ticketSettingsThemeSchema = new Schema<TicketSettingsThemeInterface>({
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

const ticketCategorySchema = new Schema<TicketCategoryInterface>({
  guild_id: {
    type: String,
    unique: true
  },
  category_id: {
    type: String,
    unique: true
  }
})

export const TicketSettingsTheme = mongoose.model("TicketSettingsTheme", ticketSettingsThemeSchema)
export const TicketSettings = mongoose.model('TicketSettings', ticketSettingsSchema);
export const TicketLogSettings = mongoose.model('TicketLogSettings', ticketLogSettingsSchema);
export const CurrentTicket = mongoose.model('CurrentTicket', currentTicketSchema);
export const TicketSettingsEmbed = mongoose.model('TicketSettingsEmbed', ticketSettingsEmbedSchema);
export const TicketCategory = mongoose.model("TicketCategory", ticketCategorySchema)

