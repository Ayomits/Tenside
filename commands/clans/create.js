const {
  CommandInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle, ChannelType
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {clanModel, clanSetupModel} = require('../../models/clans')
const {userModel} = require('../../models/users')
const fs = require('fs')
const path = require('path')

async function executeMoal(interaction){
  await interaction.deferReply()
  const clanName = interaction.fields.getField('clanName').value
  const clanDesc = interaction.fields.getField('clanDesc').value
  const clanAvatar = interaction.fields.getField('clanAvatar').value
  const clanHex = interaction.fields.getField('clanHex').value
  const clanSettings = await clanSetupModel.findOne({guild_id: interaction.guildId})

  let chat
  let voice
  let role
  let newRole

  try {
    if (!clanHex.startsWith('#')) {
      throw new Error('Ошибка валидации hex цвета');
    }

    if (await clanModel.findOne({guild_id: interaction.guildId, clanName: clanName}) !== null) {
      return await interaction.followUp({content: "Клан с таким названием уже существует", ephemeral: true})
    }
    try {
      chat = await interaction.guild.channels.create({
        name: clanName,
        parent: clanSettings.categoryId
      })
      voice = await interaction.guild.channels.create({
        name: clanName,
        parent: clanSettings.categoryId, 
        type: ChannelType.GuildVoice
      })
      
    } catch(err) {
      return await interaction.followUp({content: 'Что-то пошло не так (возможно, что админы указали неверную категорию для кланов)' + `\n ${err}`})
    }
    try {
      role = interaction.guild.roles.cache.get(clanSettings.roleId)
      let position = role.position
      newRole = await interaction.guild.roles.create({name: clanName, color: clanHex, position: position})
    }catch (err) {
      return await interaction.followUp({content: 'Что-то пошло не так (возможно, что админы указали неверную роль для кланов)' + `\n ${err}`})
    }
    
    try {
      await clanModel.create({
        guild_id: interaction.guildId, 
        clanName: clanName, 
        clanDesc: clanDesc, 
        clanAvatar: clanAvatar, 
        clanOwner: interaction.user.id, 
        clanMembers: [interaction.user.id],
        clanChat: chat.id,
        clanVoice: voice.id,
        clanRole: newRole.id
      })
    } catch(err) {
      if (chat) {
        await chat.delete();
      }
      if (voice) {
        await voice.delete();
      }
      if (newRole) {
        await newRole.delete();
      }

      return await interaction.followUp({content: "Что-то пошло не так..." + `\n ${err}`})
    }
    
    const config = JSON.parse(await fs.promises.readFile(path.resolve('configs', 'store.json')))
    await userModel.updateOne({user_id: interaction.user.id, guild_id: interaction.guildId}, {$inc: {balance: -config.clan.cost}})

    await interaction.message.edit({components: []})
    await interaction.member.roles.add(newRole.id)
    await interaction.followUp({content: 'Ваш клан успешно создан...', ephemeral: true})
  } catch (err) {
    await interaction.reply({content: 'Что-то пошло не так...' + '\n' + err, ephemeral: true})

    // Удаляем созданные каналы и роли, если они были созданы до ошибки.
    if (chat) {
      await chat.delete();
    }
    if (voice) {
      await voice.delete();
    }
    if (newRole) {
      await newRole.delete();
    }
  }

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
                  .setCustomId('clanCreateModal_' + interaction.user.id)
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
    
    await interaction.reply({embeds: [embed], components: [button]})
    interaction.client.on('interactionCreate', async (inter) => {
      if (inter.customId === inter.user.id && inter.isButton()) {
        await inter.showModal(modal)
      } 

      if (inter.isModalSubmit()){
        if (inter.customId === "clanCreateModal_" + inter.user.id) {
          try{
            await executeMoal(inter)
          }catch (err) {

          }
          
        }
      }
    })
  }
}


    