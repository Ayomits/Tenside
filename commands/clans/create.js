const {
  CommandInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle, ChannelType, ComponentType
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {clanModel, clanSetupModel} = require('../../models/clans')
const {userModel} = require('../../models/users')
const fs = require('fs')
const path = require('path')

/**
 * 
 * @param {CommandInteraction} interaction 
 */
async function modalHandler(interaction) {
  interaction.channel.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 100_000
  }).once ('collect', () => {
    console.log("хуй");
  })
}


module.exports = {
  data: new SlashCommandBuilder()
        .setName('create-clan')
        .setDescription('создание клана'),

  /**
   * 
   * @param {CommandInteraction} interaction 
   */

  async execute(interaction) {
    const userOwner = await clanModel.findOne({guild_id: interaction.guildId, clanOwner: interaction.user.id})
    
    
    if (userOwner) {
      return await interaction.reply({content: `У вас уже существует клан с названием. ${userOwner.clanName}`, ephemeral: true})
    }
    
    const config = JSON.parse(await fs.promises.readFile(path.resolve('configs', 'store.json')))
    const user = await userModel.findOne({guild_id: interaction.guildId, user_id: interaction.user.id})


    if (user.balance < config.clan.cost) {
      return await interaction.reply({content: "У вас недостаточно средств для создания клана"})
    }



    const modal = new ModalBuilder()
                  .setCustomId('createClan')
                  .setTitle('менюшка с созданием клана')
    
    const clanName = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
          .setCustomId('clanName')
          .setStyle(TextInputStyle.Short)
          .setMaxLength(30)
          .setMinLength(3)
          .setPlaceholder('Cisilia..')
          .setLabel('Название клана')
          .setRequired(true)
    )
    
    const clanDesc = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
          .setCustomId('clanDesc')
          .setStyle(TextInputStyle.Short)
          .setMaxLength(500)
          .setMinLength(0)
          .setPlaceholder('Cisilia..')
          .setLabel('Описание клана')
          .setRequired(true)
    )

    const clanAvatar = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
          .setCustomId('clanAvatar')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('http://example.com')
          .setLabel('Ссылка на аватар клана')
          .setRequired(false)
    )

    const clanRoleHex = new ActionRowBuilder().addComponents(
      new TextInputBuilder()
          .setCustomId('clanHex')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('#000000')
          .setLabel('Hex цвет вашей роли')
          .setRequired(true)
          .setMaxLength(7)
    )

    modal.addComponents(clanName, clanDesc, clanAvatar, clanRoleHex)
    

    const embed = new EmbedBuilder()
                  .setTitle("Система кланов")
                  .setDescription('Настройте внешний вид своего клана. После отправки формы, средства за клан вернуть будет невозможно. Выбирайте всё с умом!')
    
    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
          .setCustomId(interaction.user.id)
          .setLabel('заполнить форму')
          .setStyle(ButtonStyle.Secondary)
    )
    
    const msg = await interaction.reply({embeds: [embed], components: [button], fetchReply: true})
    msg.createMessageComponentCollector({
      componentType: ComponentType.Button
    }).on('collect', async (inter) => {
      if (inter.user.id === interaction.user.id) {
        await inter.showModal(modal)
      }
    })
  }
}


    