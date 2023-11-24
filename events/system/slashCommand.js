const { Interaction, Client, Events } = require('discord.js')

module.exports = {
  name: Events.InteractionCreate,
  once: false,
   /**
     * @param {Interaction} interaction
     * @param {Client} client
     */

   async execute(interaction) {
    const command = interaction.client.commands.get(interaction.commandName)
    if (!command) return;
    try {
        command.execute(interaction)
    }
    catch (err) {
        console.log(err);
    }
}
}