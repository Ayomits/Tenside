const {
  CommandInteraction
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {clanModel} = require('../../models/clans')
const {userModel} = require('../../models/users')

module.exports = {
  data: new SlashCommandBuilder()
        .setName('transferclan')
        .setDescription('создание клана')
        .addIntegerOption(option => option.setName('amount').setDescription('amount').setRequired(true)),
  
  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const amount = interaction.options.get('amount').value
    const clanMember = await clanModel.findOne({guild_id: interaction.guildId,  clanMembers: { $in: [interaction.user.id] }})

    if (!clanMember) {
      return await interaction.reply({content: "Вы не находитесь ни в одном клане"})
    }

    const user = await userModel.findOne({guild_id: interaction.guildId, user_id: interaction.user.id})

    if (Number(user.balance) < Number(amount)) {
      return await interaction.reply({content: "У вас недостаточно средств для этой операции", ephemeral: true})
    }

    await Promise.all([
      await clanModel.updateOne({guild_id: interaction.guildId, clanName: clanMember.clanName}, {$inc: {clanBalance: amount}}),
      await userModel.updateOne({guild_id: interaction.guildId, user_id: interaction.user.id}, {$inc: {balance: -amount}})
    ])
    await interaction.reply({content: "Успешно пополнена казна клана", ephemeral: true})
  }
}
