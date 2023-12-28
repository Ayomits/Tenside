const {
  CommandInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType
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

      if (clanMember.clanBanner) {
        
        try {embed.setImage(clanMember.clanBanner)}
        catch{}
      }

      const selectMenu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder().setCustomId(interaction.user.id).setPlaceholder('Выберите опцию').setOptions(
          {
            label: "Участники",
            value: "members"
          }
        )
      )

      const msg = await interaction.reply({embeds: [embed], components: [selectMenu]})

      msg.createMessageComponentCollector({
        componentType: ComponentType.StringSelect, 
        time: 60_000
      }).on('collect', async (inter) => {
        let desc = `**Глава клана:** <@${clanMember.clanOwner}>`

        let count = 1

        desc += "\n\n**Заместители клана:**\n\n"
        if (clanMember.clanDeputy.length > 0) {
          clanMember.clanDeputy.forEach(member => {
            desc += `**${count}.** <@${member}>\n`
            count += 1
          })
          count = 1
        } else {
          desc += "Отсутствуют"
        }
        
        desc += "\n\n**Участники клана:**\n\n"
        if (clanMember.clanMembers.length > 0) {
          clanMember.clanMembers.forEach(member => {
            if (clanMember.clanDeputy.includes(member) || clanMember.clanOwner === member) {
              return
            }
            desc += `**${count}.** <@${member}>\n`
            count += 1
          })
        }

        const embedMember = new EmbedBuilder()
                            .setTitle(`Участники клана ${clanMember.clanName}`)
                            .setDescription(desc)
        await inter.reply({embeds: [embedMember], ephemeral: true})

      })
    }else{
      return await interaction.reply({content: "Вы не состоите ни в одном клане", ephemeral: true})
    }
    
  }
}