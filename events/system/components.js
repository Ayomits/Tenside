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
      if(!button) return interaction.reply({ephemeral: true, content: "неизвестная ошибка кнопок"})
      else await button.execute(interaction)
    }

    if (interaction.isModalSubmit()) {
      const modal = interaction.client.modals.get(interaction.customId)
      if(!modal) return interaction.reply({ephemeral: true, content: "неизвестная ошибка модалок"})
      else await modal.execute(interaction)
    }

    if (interaction.isAnySelectMenu()) {
      const select = interaction.client.selects.get(interaction.customId)
      if (!select) return interaction.reply({ephemeral: true, content: "неизвестная ошибка селектов"})
      else await select.execute(interaction)
    }
  },
};