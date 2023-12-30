const {
  CommandInteraction
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {clanModel} = require('../../models/clans')


module.exports = {
  data: new SlashCommandBuilder()
        .setName('leave-clan')
        .setDescription('leave from clan'),
  
  /**
   * 
   * @param {CommandInteraction} interaction 
   */
  async execute(interaction) {
    const result = await clanModel.findOne({
      guild_id: interaction.guildId,
      clanMembers: { $elemMatch: { $in: [interaction.user.id] } },
    });

    if (result !== null) {
      if (result.clanOwner === interaction.user.id) {
        return await interaction.reply({content: "овнер не может покинуть свой же клан", ephemeral: true})
      }
      if (result.clanDeputy.includes(interaction.user.id)) {
        await clanModel.updateOne(
          {
            guild_id: interaction.guildId,
            clanName: result.clanName,
          },
          {
            $pull: {
              clanMembers: interaction.user.id,
              clanDeputy: interaction.user.id,
            },
          }
        )
        await interaction.member.roles.remove(result.clanRole)
        return await interaction.reply({content: "клан успешно покинут"})
      } else {
        await clanModel.updateOne(
          {
            guild_id: interaction.guildId,
            clanName: result.clanName,
          },
          {
            $pull: {
              clanMembers: interaction.user.id,
            },
          }
        )
        await interaction.member.roles.remove(result.clanRole)
        return await interaction.reply({content: "клан успешно покинут"})
      }
      
    } else {
      return await interaction.reply({content: "У вас нет клана", ephemeral: true})
    }
  }
}