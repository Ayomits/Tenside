const {
  CommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {userModel} = require('../../models/users')


module.exports = {
  data: new SlashCommandBuilder()
        .setName("transfer")
        .setDescription("передача денег пользователю")
        .addUserOption((option) =>
          option.setName("target").setDescription("target user").setRequired(false)
        ),
  
  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const targetUser = interaction.options.get("target").value

    const embed = new EmbedBuilder()
                  .setName("Проверка баланса")

    const balance = await userModel.findOne({guild_id: interaction.guildId, user_id: targetUser.user.id || interaction.user.id})

    let description = `Баланс пользователя \n` + "```" + `${balance.balance}` + "```"

    await interaction.reply({embeds: [embed.setDescription(description)]})
  }
}