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
          option.setName("target").setDescription("target user").setRequired(true)
        )
        .addNumberOption((option) =>
        option.setName("amount").setDescription("Количество валюты для выдачи").setRequired(true)
        ),
  
  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const targetUser = interaction.options.get("target")
    const amount = interaction.options.get('amount').value

    if (targetUser.user.id === interaction.user.id) {
      return await interaction.reply({content: "Так делать нельзя", ephemeral: true})
    }
    const author = await userModel.findOne({guild_id: interaction.guildId, user_id: interaction.user.id})
    if (author.balance < amount) {
      return await interaction.reply({content: "Ты слишком беден для таких действий", ephemeral: true})
    }else {
      const user = await userModel.findOne({guild_id: interaction.guildId, user_id: targetUser.user.id})

      if (user) {
        user.balance += amount
        user.save()
        author.balance -= amount
        author.save()

        const embed = new EmbedBuilder()
                    .setTitle("Перевод денег")
                    .setDescription(`Пользователь <@${author.user_id}> перевел ${amount} денег пользователю <@${user.user_id}>`)
                    .setFooter({iconURL: interaction.user.displayAvatarURL(), text: interaction.user.username})

        await interaction.reply({embeds: [embed]})
      }else {
        await interaction.reply({content: "В нашей базе данных нет таких ребят, может быть вы ошиблись номером?", ephemeral: true})
      }
    }
  }
}