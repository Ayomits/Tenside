const {
  CommandInteraction
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {clanSetupModel, clanModel} = require('../../models/clans')
const {userModel} = require('../../models/users')


module.exports = {
  data: new SlashCommandBuilder()
        .setName('create-clan')
        .setDescription('создание клана'),

  /**
   * 
   * @param {CommandInteraction} interaction 
   */

  async execute(interaction) {
    const user = await clanModel.findOne({clanOwner: interaction.user.id})
    if (interaction.user.id === user.clanOwner) {
      return await interaction.reply({content: "У вас уже имеется клан"})
    } 
    

  },
}