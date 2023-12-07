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
    const targetUser = interaction.options.get("target")

    const embed = new EmbedBuilder().setTitle("Проверка баланса")
    
    const user = targetUser.user || interaction.user

    const balance = await userModel.findOne({guild_id: interaction.guildId, user_id: user.id})
    let description = ""
    if (balance) {
       description = `Баланс: \n` + "```" + `${Math.floor(balance.balance)}` + "```"
    }else {
      description += "такого юзера не существует"
    }
    await interaction.reply({embeds: [embed.setDescription(description)]})
  }
}