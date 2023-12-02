const {CurrentTicket, TicketSettingsTheme, TicketCategory} = require("../../../models/tickets")
const {ButtonInteraction, EmbedBuilder, ComponentType, StringSelectMenuBuilder  , ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js')


module.exports = {
  customId: "ticketCreate",

  /**
   * @param {ButtonInteraction} interaction
   */

  async execute(interaction) {
    await CurrentTicket.findOne({guild_id: interaction.guildId, ticket_creator_id: interaction.user.id})
    .then(async (result) => {
      if (result === null) {
        let newChannel
        const category = await TicketCategory.findOne({guild_id: interaction.guildId}).then(async (result) => {
          if (result !== null) {
            newChannel = await interaction.guild.channels.create({name: `Тикет пользователя ${interaction.user.username}`, parent: result.category_id, position: 0, nsfw: false})
          }else {
            return await interaction.reply({content: "Не указана категория/указана некорректная категория", ephemeral: true})
          }
          }
        ).catch(async (err) => {
          return await interaction.reply({content: "Не указана категория/указана некорректная категория", ephemeral: true})
        })
        
        await CurrentTicket.create({guild_id: interaction.guildId, channel_id: newChannel.id, ticket_creator_id: interaction.user.id})
        newChannel.permissionOverwrites.create(interaction.user, {
          ViewChannel: true,
          SendMessages: false,
        })
        newChannel.permissionOverwrites.create(interaction.guild.roles.everyone, {
          ViewChannel: false,
        })
        const embed = new EmbedBuilder()
                      .setTitle(`Система поддержки сервера ${interaction.guild.name}`)
                      .setDescription(`Итак, вы создали канал. На этом этапе вам нужно выбрать тему тикета и задать свой вопрос. Будьте внимательны и выбирайте темы с умом!`)
                      .setFooter({text: `Поддержка ${interaction.guild.name}`, iconURL: interaction.guild.iconURL() || "https://i.pinimg.com/736x/45/d5/d1/45d5d164a1dde1895a070571251ff756.jpg"})
        const closeTicket = new ButtonBuilder()
                            .setCustomId('closeTicket')
                            .setLabel("Закрыть тикет")
                            .setStyle(ButtonStyle.Danger)

        const selectMenuBuilder = new StringSelectMenuBuilder()
        .setCustomId(interaction.user.id)
        .setPlaceholder("Выберите тему")

        const selectMenu = new ActionRowBuilder().addComponents(selectMenuBuilder)
        const themes = await TicketSettingsTheme.find({guild_id: interaction.guildId})
        
        if (themes) {
          for (let theme of themes) {
            selectMenuBuilder.addOptions({
              label: theme.theme_title,
              description: theme.theme_desc,
              value: theme.theme_uniq_id
            })
          }
        }

        await interaction.reply({content: "Ваш тикет в канале " + `<#${newChannel.id}>`, ephemeral: true})
        await newChannel.send({content: `<@${interaction.user.id}>`, embeds: [embed], components: [selectMenu, new ActionRowBuilder().addComponents(closeTicket)]})
        
        newChannel.createMessageComponentCollector({
          componentType: ComponentType.Button
        }).on("collect", async (inter) => {
          if (inter.customId === "closeTicket") {
          await CurrentTicket.deleteOne({guild_id: inter.guildId, channel_id: newChannel.id})
          await newChannel.delete()
          }
        })

        const collector = newChannel.createMessageComponentCollector({
          componentType: ComponentType.StringSelect
        }) 

        collector.once("collect", async (inter) => {
          const value = inter.values[0]
          const theme_ = await TicketSettingsTheme.findOne({theme_uniq_id: value})
          const spited_pinged_roles = theme_.pinged_roles.split(" ")
          let message_content = ""

          for (let i = 0; i< spited_pinged_roles.length; i++) {
            message_content += `<@&${spited_pinged_roles[i]}>`
          }
          embed.setDescription("Ваш ответ записан. Теперь напишите свою жалобу")
          embed.setFooter({iconURL: inter.guild.iconURL() || "https://i.pinimg.com/736x/45/d5/d1/45d5d164a1dde1895a070571251ff756.jpg" , text: "Выбранная тема: " + value})
          await inter.message.edit({embeds: [embed], components: []})

          const messageCollector = await newChannel.createMessageCollector({})

          await newChannel.permissionOverwrites.edit(inter.user, {
            SendMessages: true
          })

          messageCollector.once("collect", async (message) => {
            const embed_ = new EmbedBuilder()
                          .setTitle("Система поддержки")
                          .setDescription("Примите тикет")
            const AcceptTiket = new ButtonBuilder()
                                .setCustomId("acceptBtn")
                                .setLabel("принять тикет")
                                .setStyle(ButtonStyle.Success)
            
            for (role of theme_.pinged_roles.split()) {
              newChannel.permissionOverwrites.create(role, {
                ViewChannel: true,
              })
            }
            await message.channel.send({content: message_content})
            await message.channel.send({embeds: [embed_], components: [new ActionRowBuilder().addComponents(AcceptTiket)]})

            const componentCollectorFilter = i => {
              const userRoles = i.member.roles.cache
              return spited_pinged_roles.some(roleId => userRoles.has(roleId))
            }

            message.channel.createMessageComponentCollector({
              componentType: ComponentType.Button,
              filter: componentCollectorFilter
            }).on("collect", async (inter) => {
              if (inter.customId === "acceptBtn") {
              await inter.reply({content: "вы успешно приняли тикет", ephemeral: true})
              await inter.message.edit({embeds: [embed_.setDescription("Найден отвечающий..")], components: []})
              await inter.channel.permissionOverwrites.edit(inter.user, {
                SendMessages:true
              })
            }
            })
          })
        })
        
      }
      else {
        await interaction.reply({content: `У вас уже создан тикет в канале <#${result.channel_id}>`, ephemeral: true})
      }
    })
    .catch((err) => {
      console.log(err);
    })
  },
};
