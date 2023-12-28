const {
  CommandInteraction
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {clanModel} = require('../../models/clans')


module.exports = {
  data: new SlashCommandBuilder()
        .setName('kick-clan')
        .setDescription('пригласить в клан')
        .addUserOption(option => 
              option.setName('target').setDescription('target user').setRequired(true)),
  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const targetUser = interaction.options.getMember('target')

    const canKick = await clanModel.findOne({
      $or: [
        { clanDeputy: { $in: [interaction.user.id] } },
        { clanOwner: interaction.user.id }
      ]
    });

    if (canKick === null) {
      return await interaction.reply({content: "Вы не являетесь заместителем или главой клана", ephemeral: true})
    }

    if (canKick.clanMembers.includes(targetUser.user.id)) {
      if (canKick.clanDeputy.includes(targetUser.user.id) || canKick.clanOwner === targetUser.user.id) {
        await interaction.reply({content: "Ошибка, вы не можете выгнать главу или заместителя из клана", ephemeral: true})
      } else {
        await clanModel.updateOne({clanName: canKick.clanName}, {$pull: {clanMembers: targetUser.user.id}})
        await targetUser.roles.remove(canKick.clanRole)
        await interaction.reply({content: `Пользователь <@${targetUser.user.id}> успешно выгнан с вашего клана`, ephemeral: true})
      }
    }else {
      await interaction.reply({content: "Ошибка, данный пользователь не находится в вашем клане", ephemeral: true})
    }

    
  }               
}