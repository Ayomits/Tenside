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
    const clanMember = await clanModel.findOne({guild_id: interaction.guildId, clanMembers: { $in: [interaction.user.id] } });

    if (clanMember !== null) {
      const embed = new EmbedBuilder()
                    .setTitle(`Клан ${clanMember.clanName}`)
                    .setDescription(`## [${clanMember.clanLevel}]${clanMember.clanName} \n ${clanMember.clanDesc}`)
                    .addFields(
                      {
                        name: "Владелец",
                        value: "```" + `${interaction.guild.members.cache.get(clanMember.clanOwner).user.username}` + "```",
                        inline: true
                      },
                      {
                        name: "Баланс",
                        value: "```" + `${clanMember.clanBalance}` + "```",
                        inline: true
                      },
                      {
                        name: "Кол-во участников",
                        value: "```" + `${clanMember.clanMembers.length}/${clanMember.clanMaxSlots}` + "```",
                        inline: true
                      },
                      
                      {
                        name: "Уровень клана",
                        value: "```" + `${clanMember.clanLevel}` + "```",
                        inline: false
                      },
                      {
                        name: "Заместители",
                        value: "```" + `${clanMember.clanDeputy.length > 0 
                          ? `${clanMember.clanDeputy.map(deputy => interaction.guild.members.cache.get(deputy).user.username)}`
                          : "Отсутствует"}` + "```",
                        inline: false 
                      },
                      {
                        name: "Роль клана",
                        value: `<@&${clanMember.clanRole}>`,
                        inline: false
                      }
                    )
                    
      
      if (clanMember.clanAvatar) {
        try{embed.setThumbnail(clanMember.clanAvatar)} 
        catch {}
        
      }
      return await interaction.reply({embeds: [embed]})
    }
    return await interaction.reply({content: "Вы не состоите ни в одном клане", ephemeral: true})
  }
}