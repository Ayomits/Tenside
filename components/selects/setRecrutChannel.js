const {
  ButtonInteraction,
} = require("discord.js");
const {
  systemAnketaRecrutChannel
} = require("../../models/system_message/models");


module.exports = {
  customId: "setRecrutChannel",

  /**
   * @param {ButtonInteraction} interaction
   */

  async execute(interaction) {
    const values = interaction.values[0];
    await systemAnketaRecrutChannel.create({channel_id: values, guild_id: interaction.guildId}).then(async () => {
      await interaction.reply("Отлично, канал создан")
    }).catch(async () => {
      await interaction.reply("Видимо, такой канал уже указан")
    }) 
  }
}