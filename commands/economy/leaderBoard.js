const { CommandInteraction, EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { userModel } = require("../../models/users");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("top")
    .setDescription("топ шейхов сервера"),

  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const devs = JSON.parse(process.env.DEVELOPERS);

    const users = await userModel
      .find({ guild_id: interaction.guildId, user_id: { $nin: devs } })
      .sort({ balance: -1 })
      .limit(10);

    let description = "";

    for (let user of users) {
      description += `<@${user.user_id}> - ${user.balance} $\n`;
    }

    const embed = new EmbedBuilder()
      .setTitle(`Топ 10 шейхов сервера ${interaction.guild.name}`)
      .setDescription(description)
      .setFooter({
        iconURL: interaction.user.avatarURL(),
        text: interaction.user.username,
      });

    await interaction.reply({ embeds: [embed] });
  },
};
