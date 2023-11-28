const {
  ButtonInteraction,
} = require("discord.js");
const {
  systemAnketaRecrutChannel
} = require("../../../models/system_message/models");


module.exports = {
  customId: "setRecrutChannel",

  /**
   * @param {ButtonInteraction} interaction
   */

  async execute(interaction) {
    const values = interaction.values[0];
    await systemAnketaRecrutChannel.create({channel_id: values, guild_id: interaction.guildId}).then(async () => {
      await interaction.reply({content: "Отлично, канал создан", ephemeral: true})
    }).catch(async () => {
      await systemAnketaRecrutChannel.update({channel_id: values}, {where: {guild_id: interaction.guildId}})
      await interaction.reply({content: "Канал был обновлен", ephemeral: true})
    }) 
  }
}