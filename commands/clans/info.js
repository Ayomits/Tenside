const {
  CommandInteraction, EmbedBuilder
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {clanModel} = require('../../models/clans')

module.exports = {
  data: new SlashCommandBuilder()
        .setName('info-clan')
        .setDescription('создание клана'),
  
  /**
   * 
   * @param {CommandInteraction} interaction 
   */
  async execute(interaction) {
    const clanMember = await clanModel.findOne({ clanMembers: { $in: [interaction.user.id] } });

    if (clanMember !== null) {
      const embed = new EmbedBuilder()
                    .setTitle(`Клан ${clanMember.clanName}`)
                    .setDescription(``)
    }
  }
}