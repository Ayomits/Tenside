const {ModalSubmitInteraction} = require('discord.js')
const { clanModel } = require('../../../models/clans')
const fs = require("fs");
const path = require("path");

module.exports = {
  customId: "clanCustomize",

  /**
   * @param {ModalSubmitInteraction} interaction
   */

  async execute(interaction) {
    await interaction.deferReply()
    const config = JSON.parse(await fs.promises.readFile(path.resolve('configs', 'store.json')))
    const result = await clanModel.findOne({
      guild_id: interaction.guildId,
      clanMembers: { $elemMatch: { $in: [interaction.user.id] } },
    });


    if (result.clanBalance < Number(config.customize)) {
      return await interaction.followUp({content: "невозможно сменить оформление клану", ephemeral: true})
    }

    if (result.clanLevel < 2) {
      return await interaction.followUp({content: "У вас маленький уровень клана!", ephemeral: true})
    }

    const clanName = interaction.fields.getField('clanName').value
    const clanHex = interaction.fields.getField('clanHex').value
    const clanAvatar = interaction.fields.getField('clanAvatar').value 
    const clanDesc = interaction.fields.getField('clanDesc').value
    const clanBanner = interaction.fields.getField('clanBanner').value

    await clanModel.updateOne({
      guild_id: interaction.guildId, clanName: result.clanName
    }, 
    {
      $inc: {clanBalance: -config.customize}, 
      $set: {clanAvatar: clanAvatar, clanName: clanName, clanDesc: clanDesc, clanBanner: clanBanner}
    })

    try{
      console.log("дошел до ролей");
      interaction.guild.roles.cache.get(result.clanRole).setColor(clanHex).setName(clanName)
      console.log("прошёл роли");
    }
    catch (err) {
      return await interaction.channel.send({content: "Что-то пошло не так" + `\n ${err}`})
     }

    try {
      console.log("дошел до каналов");
      interaction.guild.channels.cache.get(result.clanChat).setName(clanName)
      interaction.guild.channels.cache.get(result.clanVoice).setName(clanName)
      console.log("прошёл каналы");
    }catch (err) {
      return await interaction.channel.send({content: "Что-то пошло не так" + `\n ${err}`})
     }

    return await interaction.followUp({content: "Все параметры успешно изменены", ephemeral: true})
    
    
  }
}