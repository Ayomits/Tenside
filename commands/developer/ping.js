const {
  CommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

const devs = JSON.parse(process.env.DEVELOPERS)

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping_")
    .setDescription("Проверка задержи бота")
    .setDMPermission(true),

  /**
   *
   * @param {CommandInteraction} interaction
   *
   */
  async execute(interaction) {
      if (devs.includes(String(interaction.user.id))){
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
    } else return await interaction.reply({content: "У вас нет права для написания этой команды", ephemeral: true})
    }
};
