const { CommandInteraction, EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { userModel } = require("../../models/users");
const { workModel } = require("../../models/users");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Работать"),
  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const user = await userModel.findOne({
      guild_id: interaction.guildId,
      user_id: interaction.user.id,
    });

    const embed = new EmbedBuilder().setTitle(
      `Eжедневная плата пользователю ${interaction.user.displayName}`
    );

    const worktime = await workModel.findOne({
      guild_id: interaction.guildId,
      user_id: interaction.user.id,
    });

    if (worktime) {
      if (worktime.next_work < new Date()) {
        embed.setDescription("Вы уже работали менее, чем 2 часа назад!")
      } else {
        const money = getRandomInt(300, 100);
        const newBalance = user.balance + money;
        const newdate = String(Number(Date.now()) + 7200)
        await userModel.updateOne(
            { guild_id: interaction.guildId, 
              user_id: interaction.user.id },
            { balance: newBalance }
        );
        await workModel.updateOne(
            { guild_id: interaction.guildId, 
              user_id: interaction.user.id },
            { next_work: newdate }
        );

        embed.setDescription(`Деньги получены. Вам дали ${money} денег.`)
      }
    } else {
        await workModel.create({
            guild_id: interaction.guildId,
            user_id: interaction.user.id,
        });

        const money = getRandomInt(300, 100);
        const newBalance = user.balance + money;
        const newdate = String(Number(Date.now()) + 7200)

        await userModel.updateOne(
            { guild_id: interaction.guildId, 
              user_id: interaction.user.id },
            { balance: newBalance }
        );
        await workModel.updateOne(
            { guild_id: interaction.guildId, 
              user_id: interaction.user.id },
            { next_work: newdate }
        );

        embed.setDescription(`Деньги получены. Вам дали ${money} денег.`)
    }

    await interaction.reply({ embeds: [embed.setDescription(description)] });
  },
};
