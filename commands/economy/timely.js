const { CommandInteraction, EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { userModel } = require("../../models/users");
const { TimelyModel } = require("../../models/users");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timely")
    .setDescription("Получение валюты"),
  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const user = await userModel.findOne({
      guild_id: interaction.guildId,
      user_id: interaction.user.id,
    });
    const embed = new EmbedBuilder().setTitle(
      `ежедневная плата - ${interaction.user.displayName}`
    );
    const timely = await TimelyModel.findOne({
      guild_id: interaction.guildId,
      user_id: interaction.user.id,
    });
    if (timely) {
      embed.setDescription(`Вы уже забрали ежедневную награду`);
      return await interaction.reply({ embeds: [embed] });
    }
    await TimelyModel.create({
      guild_id: interaction.guildId,
      user_id: interaction.user.id,
    });
    const money = getRandomInt(600, 100);
    const updatedTargetBalance = user.balance + money;
    const balance = await userModel.updateOne(
      { guild_id: interaction.guildId, user_id: interaction.user.id },
      { balance: updatedTargetBalance }
    );

    let description = "";
    if (balance) {
      description = `Получено:\n\`\`\`${money}\`\`\``;
    }
    await interaction.reply({ embeds: [embed.setDescription(description)] });
  },
};
