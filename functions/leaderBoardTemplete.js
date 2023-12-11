async function topTemplate (interaction, field) {
  const devs = JSON.parse(process.env.DEVELOPERS);

  const users = await userModel
    .find({ guild_id: interaction.guildId, user_id: { $nin: devs } })
    .sort({ field: -1 })
    .limit(10);

  let description = "";
  let count = 1;

  for (let user of users) {
    description += `**#${count}.** <@${user.user_id}> - \`${user.field}\` <:solana:1183097799756238858>\n\n`;
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
}

module.exports = {topTemplate}