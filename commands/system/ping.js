const {
  CommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Проверка задержи бота")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(true),

  /**
   *
   * @param {CommandInteraction} interaction
   *
   */
  async execute(interaction) {
      const ping = interaction.createdTimestamp - Date.now();
      const embed = new EmbedBuilder()
        .setTitle("Проверка задержки бота")
        .setFields(
          {
            name: "Задержка сообщения",
            value: `> **${Math.abs(ping)} ms**`,
            inline: true,
          },
          {
            name: "Задержка вебсокета",
            value: `> **${Math.abs(interaction.client.ws.ping)} ms**`,
            inline: true,
          }
        );
      return await interaction.reply({ embeds: [embed] });
    }
};
