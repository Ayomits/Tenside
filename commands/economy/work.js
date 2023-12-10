const { CommandInteraction, EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { userModel } = require("../../models/users");
const { workModel } = require("../../models/users");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

async function giveMoney(interaction) {
    const money = getRandomInt(300, 100);
    const newdate = String(Number(Date.now()) + 7200)
    await userModel.updateOne(
        { guild_id: interaction.guildId, 
          user_id: interaction.user.id },
        { $inc: {balance: money} }
    );
    
    await workModel.updateOne(
        { guild_id: interaction.guildId, 
            user_id: interaction.user.id },
        { $set: {next_work: newdate} }
    );

    return money
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Работать"),
  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
     await userModel.findOne({
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

    let now = Date.now()

    let newMoney = 0
    if (worktime) {

      let nextWorkTimestamp = new Date(worktime.next_work).getTime()

      if (nextWorkTimestamp > now) {
        embed.setDescription("Вы уже работали менее, чем 2 часа назад!")
      } else {
        newMoney = await giveMoney(interaction)
        
        await workModel.updateOne(
            { guild_id: interaction.guildId, 
                user_id: interaction.user.id },
            { $set: {next_work: String(Number(Date.now()) + 7200)} }
        );

      }
    } else {
        await workModel.create({
            guild_id: interaction.guildId,
            user_id: interaction.user.id,

            next_work: String(Number(Date.now()) + 7200)
        });

        newMoney = await giveMoney(interaction)
    }

    await interaction.reply({ embeds: [embed.setDescription(`Деньги получены. Вам дали ${newMoney} денег.`)] });
  },
};