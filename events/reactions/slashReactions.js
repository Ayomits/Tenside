const { Events, CommandInteraction } = require("discord.js");
const react = require("../../handlers/features/reactHandler");
const axios = require('axios')

module.exports = {
  name: Events.InteractionCreate,
  
  /**
   * @param {CommandInteraction} interaction;
   */
  async execute(interaction) {
    const command = interaction.client.reactions.get(interaction.commandName)
    if (!command) return;
    try {
      await axios
      .get(
        `${process.env.API_URL}/gif?reaction=${command}&format=${process.env.FORMAT}`
      )
      .then(async (response) => {
        await react(interaction.message, command, response.data.url)
      })
      .catch(() => {
        return;
      });
    } catch (err) {
      console.log(err);
    }
  }
}