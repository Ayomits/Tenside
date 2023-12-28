const { ModalSubmitInteraction, ChannelType } = require("discord.js")
const { clanModel, clanSetupModel } = require("../../../models/clans")
const { userModel } = require("../../../models/users")
const fs = require('fs')
const path = require('path')

module.exports = {
  customId: "createClan",

  /**
   * @param {ModalSubmitInteraction} interaction 
   */

  async execute(interaction) {
    await interaction.deferReply()
    const clanName = interaction.fields.getField('clanName').value
    const clanDesc = interaction.fields.getField('clanDesc').value
    const clanAvatar = interaction.fields.getField('clanAvatar').value
    const clanBanner = interaction.fields.getField('clanBanner').value
    const clanHex = interaction.fields.getField('clanHex').value
    const clanSettings = await clanSetupModel.findOne({guild_id: interaction.guildId})
    const clanIsExists = await clanModel.findOne({clanName: clanName})
    

    if (clanIsExists) {
      return await interaction.reply({content: "Увы и ах, клан с таким именем существует", ephemeral: true})
    }

    const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

    if (!regex.test(clanHex)) {
      return await interaction.editReply({content: "Не валидный Hex цвет", ephemeral: true})
    }
    
    const category = interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildCategory).get(clanSettings.categoryId)
    const role = interaction.guild.roles.cache.get(clanSettings.roleId)
    
    if (!role) {
      return await interaction.editReply({content: "Мы долго искали, мы долго пытались, но роль кланов так и не нашли..", ephemeral: true})
    }

    if (!category) {
      return await interaction.editReply({content: "Мы долго искали, мы долго пытались, но категорию кланов так и не нашли...", ephemeral: true})
    }
    
    const newRole = await interaction.guild.roles.create({name: clanName, position: role.position, color: clanHex})
    const chat = await interaction.guild.channels.create({name: clanName, parent: category.id})
    const voice = await interaction.guild.channels.create({name: clanName, parent: category.id, type: ChannelType.GuildVoice})


    await Promise.all([
      voice.permissionOverwrites.create(interaction.guild.roles.everyone, {
        ViewChannel: false
      }),

      voice.permissionOverwrites.create(newRole.id, {
        ViewChannel: true,
        Connect: true,
        SendMessages: false
      }),

      chat.permissionOverwrites.create(interaction.guild.roles.everyone, {
        ViewChannel: false
      }),

      chat.permissionOverwrites.create(interaction.user.id, {
        ManageMessages: true,
        CreatePrivateThreads: true,
        ManageWebhooks: true
      }),

      chat.permissionOverwrites.create(newRole.id, {
        ViewChannel: true,
        Connect: true,
        SendMessages: true
      }),
    ])

    const config = JSON.parse(await fs.promises.readFile(path.resolve('configs', 'store.json')))

    await clanModel.create({
      guild_id: interaction.guildId, 
      clanName: clanName, 
      clanDesc: clanDesc, 
      clanAvatar: clanAvatar, 
      clanOwner: interaction.user.id, 
      clanMembers: [interaction.user.id],
      clanChat: chat.id,
      clanVoice: voice.id,
      clanRole: newRole.id,
      clanBanner: clanBanner
    })

    await userModel.updateOne({guild_id: interaction.guildId, user_id: interaction.user.id}, {$inc: {balance: -config.clan.cost}})

    await interaction.member.roles.add(newRole.id)
    await interaction.followUp({content: `Ваш клан успешно создан. Ваши каналы: [ \n<#${chat.id}> ,\n <#${voice.id}> \n ]`})
  }
}