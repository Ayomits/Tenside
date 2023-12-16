const {embedBuilderModalCallback} = require("../../../functions/embedGen")
const {clanModel, clanSetupModel} = require("../../../models/clans")
const {userModel} = require('../../../models/users')
const {ModalSubmitInteraction, ChannelType} = require("discord.js")
const fs = require('fs')
const path = require('path')



module.exports = {
  customId: 'clanCreate',

  /**
   * @param {ModalSubmitInteraction} interaction
   */

  async execute(interaction) {
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

      chat = await interaction.guild.channels.create({
        name: clanName,
        parent: clanSettings.categoryId
      })
      
      voice = await interaction.guild.channels.create({
        name: clanName,
        parent: clanSettings.categoryId, 
        type: ChannelType.GuildVoice
      })
      
      role = interaction.guild.roles.cache.get(clanSettings.roleId)
      let position = role.position
      newRole = await interaction.guild.roles.create({name: clanName, color: clanHex, position: position})

      await clanModel.create({
        guild_id: interaction.guildId, 
        clanName: clanName, 
        clanDesc: clanDesc, 
        clanAvatar: clanAvatar, 
        clanOwner: interaction.user.id, 
        clanMembers: [interaction.user.id],
        clanChat: chat.id,
        clanVoice: voice.id,
        clanRoleHex: clanHex,
        clanRole: newRole.id
      })
      const config = JSON.parse(await fs.promises.readFile(path.resolve('configs', 'store.json')))
      await userModel.updateOne({user_id: interaction.user.id, guild_id: interaction.guildId}, {$inc: {balance: -config.clan.cost}})

      await interaction.message.edit({components: []})
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
}