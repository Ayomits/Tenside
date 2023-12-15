import { CommandInteraction, Client, Events, ChatInputCommandInteraction } from "discord.js";
import { BotEvent } from "../../types";


export const slashCommand: BotEvent = {
  name: Events.InteractionCreate,
  once: false,
   /**
     * @param {Interaction} CommandInteraction
     */

   async execute(interaction: CommandInteraction) {
    const command = interaction.client.commands.get(interaction.commandName)
    if (!command) return;
    try {
      await command.execute(interaction)
    }
    catch (err) {
        console.log(err);
    }
  }
}