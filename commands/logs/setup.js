const {
  CommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setuplogs")
    .setDescription("Установка канала с логами")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
      option
        .setName("logchannel")
        .setDescription("установка канала логов")
        .setRequired(true)
    ),
  /**
   * 
   * @param {CommandInteraction} interaction 
   */
  async execute(interaction) {
    return await interaction.reply('команда в разработке');
  }
};