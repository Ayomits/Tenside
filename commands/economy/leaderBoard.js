const { CommandInteraction, EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { userModel } = require("../../models/users");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("top")
    .setDescription("Лист пользователей на сервере по деньгам"),

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
    let count = 1;

    for (let user of users) {
      description += `**#${count}.** <@${user.user_id}> - \`${user.balance}\` <:image:1183098175599419522>\n\n`;
      count += 1
    }

    const embed = new EmbedBuilder()
      .setTitle(`Топ 10 по деньгам сервера ${interaction.guild.name}`)
      .setDescription(description)
      .setColor('#bdb022')
      .setFooter({
        iconURL: interaction.user.avatarURL(),
        text: interaction.user.username,
      });

    await interaction.reply({ embeds: [embed] });
  },
};