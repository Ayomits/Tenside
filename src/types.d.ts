import { SlashCommandBuilder, CommandInteraction, Collection, PermissionResolvable, Message, AutocompleteInteraction, ChatInputCommandInteraction, ButtonInteraction, AnySelectMenuInteraction, ModalSubmitInteraction } from "discord.js"

export interface SlashCommand {
    data: SlashCommandBuilder,
    execute: (interaction : ChatInputCommandInteraction) => void,
    autocomplete?: (interaction: AutocompleteInteraction) => void,
    modal?: (interaction: ModalSubmitInteraction<CacheType>) => void,
    cooldown?: number // in seconds
}

export interface BotEvent {
  name: string,
  once?: boolean | false,
  execute: (...args?) => void
}

export interface Button {
  customId: string,
  execute: (interaction: any) => void
}

export interface User {
  userId: string
}

declare module 'discord.js'{
  export interface Client {
    commands: Collection<string, SlashCommand>,
    buttons: Collection<string, Button>,
    voiceUsers: Collection<string, any>
  }
}

