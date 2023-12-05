const { Interaction, Client, Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */

  async execute(interaction) {
    if (interaction.isButton()) {
      const button = interaction.client.buttons.get(interaction.customId)
      if(!button) return
      else await button.execute(interaction)
    }

    if (interaction.isModalSubmit()) {
      const modal = interaction.client.buttons.get(interaction.customId)
      if(!modal) return
      else await modal.execute(interaction)
    }

    if (interaction.isAnySelectMenu()) {
      const select = interaction.client.buttons.get(interaction.customId)
      if (!select) return
      else await select.execute(interaction)
    }
  },
};