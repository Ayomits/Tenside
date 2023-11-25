const {
  CommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reactionshelp")
    .setDescription("Все команды реакций")
    .setDMPermission(true),

  /**
   *
   * @param {CommandInteraction} interaction
   *
   */
  async execute(interaction) {
    const congfigs = path.resolve("configs");
    const data = JSON.parse(
      await fs.promises.readFile(congfigs + "/reactions.json")
    );
    const embed = new EmbedBuilder().setTitle("Помощь по командам реакций");

    let description = "";
    for (let react in data) {
      description += `**${data[react].api_name}** - ${data[react].action}\n`;
    }

    embed.setDescription(description);

    await interaction.reply({ embeds: [embed] });
  },
};
