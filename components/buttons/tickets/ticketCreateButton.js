const {CurrentTicket} = require("../../../models/tickets")
const {ButtonInteraction, EmbedBuilder, ComponentType, StringSelectMenuBuilder, InteractionWebhook, ActionRowBuilder} = require('discord.js')

module.exports = {
  customId: "ticketCreate",

  /**
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    await CurrentTicket.findOne({guild_id: interaction.guildId, ticket_creator_id: interaction.user.id})
    .then(async (result) => {
      if (result === null) {
        const newChannel = await interaction.guild.channels.create({name: `Тикет пользователя ${interaction.user.username}`, parent: "1111018589407936523", position: 0, nsfw: false})
        const embed = new EmbedBuilder()
                      .setTitle(`Система поддержки сервера ${interaction.guild.name}`)
                      .setDescription(`Итак, вы создали канал. На этом этапе вам нужно выбрать тему тикета и задать свой вопрос. Будьте внимательны и выбирайте темы с умом!`)
                      .setFooter({text: `Поддержка ${interaction.guild.name}`, iconURL: interaction.guild.iconURL() || "https://i.pinimg.com/736x/45/d5/d1/45d5d164a1dde1895a070571251ff756.jpg"})
        
        const selectMenu = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder()
                          .setCustomId(interaction.user.id)
                          .setPlaceholder("Выберите тему")
                          .setOptions(
                            {label: "лабел", value: "label"}
                          )
        )
                          
        await newChannel.send({embeds: [embed], components: [selectMenu]})

        const collector = newChannel.createMessageComponentCollector({
          componentType: ComponentType.StringSelect
        }) 

        // collector.on("collect", async (inter) => {
        //   if (inter.user.id != inter.customId) {
        //     return await inter.reply({content: "Это не твоя кнопка", ephemeral: true})
        //   }else {
        //     await inter.reply({content: "response!!"})
        //   }
        // })
        
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
