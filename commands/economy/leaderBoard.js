const { CommandInteraction, EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { userModel } = require("../../models/users");

async function topTemplate (query, sticker) {
  let desc = ""
  let count = 1
  query.forEach(user => {
    desc += `${count}. <@${user.user_id}> ${user.balance} ${sticker}\n`
  })

  return desc
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("top")
    .setDescription("Топ")
    .addStringOption(option => option.setName('value').setDescription('value').addChoices(
      {
        name: "balance",
        value: "balance"
      },
      {
        name: "candy",
        value: "candy"
      }
    ).setRequired(true)),

  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const value = interaction.options.get('value').value
    const devs = JSON.parse(process.env.DEVELOPERS);
    let query
    switch(value) {
      case 'balance': 
        query = await userModel
        .find({ guild_id: interaction.guildId, user_id: { $nin: devs } })
        .sort({ balance: -1 })
        .limit(10);
        break
      case 'candy':
        query = await userModel
        .find({ guild_id: interaction.guildId, user_id: { $nin: devs } })
        .sort({ candy: -1 })
        .limit(10);
        break
    }
    const desc =  await topTemplate(query, value === "balance" ? process.env.MONEY_STICKER : "🍬")

    const embed = new EmbedBuilder()
                  .setTitle('Топ пользователей по ' + value === "balance" ? process.env.MONEY_STICKER : "🍬")
                  .setDescription(desc)
    
    return await interaction.reply({embeds: [embed]})
  },
};