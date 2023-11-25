const { Interaction, Client, Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */

  async execute(interaction) {
    if (!interaction.isButton()) return;

    const button = client.buttons.get(interaction.customId)

    if(!button) return interaction.reply({ephemeral: true, content: "неизвестная ошибка"})
    else await button.execute(interaction)
  },
};
