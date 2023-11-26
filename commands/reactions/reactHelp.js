const { CommandInteraction, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reactionshelp")
    .setDescription("Все команды реакций")
    .setDMPermission(true),

  async execute(interaction) {
    const configs = path.resolve("configs");
    const data = JSON.parse(await fs.promises.readFile(configs + "/reactions.json"));
    const doubleembed = new EmbedBuilder().setTitle("Помощь по командам реакций");
    const embeds = [];

    for (let react in data) {
      if (data[react].type === 'Любовные' || data[react].type === 'Эмоции' || data[react].type === 'Действия') {
        const embed = new EmbedBuilder().setTitle(`${data[react].type} Команды`);
        embed.setDescription(data[react].api_name + "-" + data[react].action);
        embeds.push(embed);
      }
    else {
      const embed = new EmbedBuilder().setTitle("Помощь по командам реакций");
      embed.setDescription("Команд с такими категориями не существует.");
      await interaction.reply({ embeds: [embed, embeds] });
    }}
    await interaction.reply({ embeds: [embed, embeds] });
  },
};