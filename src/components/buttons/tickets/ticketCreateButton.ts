import { Button } from "../../../types";

import {CurrentTicket, TicketSettingsTheme, TicketCategory} from "../../../models/tickets"

import {ButtonInteraction, EmbedBuilder, ComponentType, StringSelectMenuBuilder  , ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuInteraction, Message} from 'discord.js'


const button: Button = {
  customId: "ticketCreate",

  /**
   * @param {ButtonInteraction} interaction
   */

  async execute(interaction: ButtonInteraction) {
    if (interaction.customId === this.customId) {
    await CurrentTicket.findOne({guild_id: interaction.guildId, ticket_creator_id: interaction.user.id})
    .then(async (result) => {
      if (result === null) {
        let newChannel: any
        const category = await TicketCategory.findOne({guild_id: interaction.guildId}).then(async (result) => {
          if (result !== null) {
            newChannel = await interaction.guild?.channels?.create({name: `Тикет пользователя ${interaction.user.username}`, parent: result.category_id, position: 0, nsfw: false})
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
        newChannel.permissionOverwrites.create(interaction.guild?.roles.everyone, {
          ViewChannel: false,
        })
        const embed = new EmbedBuilder()
                      .setTitle(`Система поддержки сервера ${interaction.guild?.name}`)
                      .setDescription(`Итак, вы создали канал. На этом этапе вам нужно выбрать тему тикета и задать свой вопрос. Будьте внимательны и выбирайте темы с умом!`)
                      .setFooter({text: `Поддержка ${interaction.guild?.name}`, iconURL: interaction.guild?.iconURL() || "https://i.pinimg.com/736x/45/d5/d1/45d5d164a1dde1895a070571251ff756.jpg"})
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
        }).on("collect", async (inter: ButtonInteraction) => {
          if (inter.customId === "closeTicket") {
          await CurrentTicket.deleteOne({guild_id: inter.guildId, channel_id: newChannel.id})
          await newChannel.delete()
          }
        })

        const collector = newChannel.createMessageComponentCollector({
          componentType: ComponentType.StringSelect
        }) 

        collector.once("collect", async (inter: StringSelectMenuInteraction) => {
          const value = inter.values[0]
          const theme_: any = await TicketSettingsTheme.findOne({theme_uniq_id: value})
          const spited_pinged_roles = theme_.pinged_roles.split(" ")
          let message_content = ""

          for (let i = 0; i< spited_pinged_roles.length; i++) {
            message_content += `<@&${spited_pinged_roles[i]}>`
          }
          embed.setDescription("Ваш ответ записан. Теперь напишите свою жалобу")
          embed.setFooter({iconURL: inter.guild?.iconURL() || "https://i.pinimg.com/736x/45/d5/d1/45d5d164a1dde1895a070571251ff756.jpg" , text: "Выбранная тема: " + value})
          await inter.message.edit({embeds: [embed], components: []})

          const messageCollector = await newChannel.createMessageCollector({})

          await newChannel.permissionOverwrites.edit(inter.user, {
            SendMessages: true
          })

          messageCollector.once("collect", async (message: Message) => {
            const embed_ = new EmbedBuilder()
                          .setTitle("Система поддержки")
                          .setDescription("Примите тикет")
            const AcceptTiket = new ButtonBuilder()
                                .setCustomId("acceptBtn")
                                .setLabel("принять тикет")
                                .setStyle(ButtonStyle.Success)
            try {
            for (const role of theme_.pinged_roles.split()) {
              try {
              await newChannel.permissionOverwrites.create(role, {
                ViewChannel: true,
              })
            }catch (err) {
              await CurrentTicket.findOneAndDelete({guild_id: inter.guildId, channel_id: inter.channel?.id})
              await inter.user.send("канал был удалён, т.к. не найден отвечающий")
              return await inter.channel?.delete()
            }
            }
          } catch (err) {
            await CurrentTicket.findOneAndDelete({guild_id: inter.guildId, channel_id: inter.channel?.id})
            try{await inter.user.send("канал был удалён, т.к. не найден отвечающий")}
            catch (err) {console.error(err)}
            return await inter.channel?.delete()
          }
            const component: any = new ActionRowBuilder().addComponents(AcceptTiket)
            await message.channel.send({content: message_content})
            await message.channel.send({embeds: [embed_], components: [component]})

            const componentCollectorFilter: any = (i: any) => {
              const userRoles = i.member?.roles?.cache;
              return spited_pinged_roles.some((roleId: string) => userRoles.has(roleId));
            };

            message.channel.createMessageComponentCollector({
              componentType: ComponentType.Button,
              filter: componentCollectorFilter
            }).on("collect", async (inter: any) => {
              if (inter.customId === "acceptBtn") {
              await inter.reply({content: "вы успешно приняли тикет", ephemeral: true})
              await inter.message.edit({embeds: [embed_.setDescription("Найден отвечающий..")], components: []})
              await inter.channel?.permissionOverwrites.edit(inter.user, {
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
    })} else {
      await interaction.reply({content: "something wrong...."})
    }
  },
};