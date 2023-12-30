const {
  CommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {userModel} = require('../../models/users')


module.exports = {
  data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("проверка баланса")
        .addUserOption((option) =>
          option.setName("target").setDescription("target user").setRequired(false)
        ),
  
  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const targetUser = interaction.options.getUser("target")

    
    const user = targetUser || interaction.user
    const embed = new EmbedBuilder().setTitle(`Баланс пользователя - ${user.displayName}`)

    const balance = await userModel.findOne({guild_id: interaction.guildId, user_id: user.id})
    let description = ""
    if (balance) {
       description = `Баланс ${process.env.MONEY_STICKER}: \n` + "```" + `${Math.floor(balance.balance)}` + "```"
       description += `Конфетки 🍬: \n` + "```" + `${Math.floor(balance.candy)}` + "```"
    }else {
      description += "такого юзера не существует"
    }
    await interaction.reply({embeds: [embed.setDescription(description)]})
  }
}