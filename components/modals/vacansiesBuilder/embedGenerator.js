const {ModalSubmitInteraction, EmbedBuilder} = require('discord.js')
const { systemAnketaEmbed } = require('../../../models/system_message/models')

module.exports = {
  customId: 'embedGenerator',

  /**
   * @param {ModalSubmitInteraction} interaction
   */

  async execute(interaction) {
    const embedTitle = interaction.fields.getTextInputValue("embedTitle")
    const embedDescription = interaction.fields.getTextInputValue('embedDescription')
    const embedImage = interaction.fields.getTextInputValue('embedImage')
    const embedColor = interaction.fields.getTextInputValue('embedColor')


    await systemAnketaEmbed.create({
      guild_id: interaction.guildId,
      title: embedTitle,
      description: embedDescription,
      color: embedColor,
      imageLink: embedImage ? embedImage != null : "https://media.discordapp.net/attachments/1166714499693281400/1178218736470200330/image.png?format=webp&width=1340&height=502"
    }).then(async () => {
      await interaction.reply({content: "успешно создан эмбед", ephemeral: true})
    }).catch(async () => {
      await systemAnketaEmbed.update({
        title: embedTitle,
        description: embedDescription,
        color: embedColor,
        imageLink: embedImage ? embedImage != null : "https://media.discordapp.net/attachments/1166714499693281400/1178218736470200330/image.png?format=webp&width=1340&height=502"
      }, {where: {guild_id: interaction.guildId}})
      await interaction.reply({content: "успешно обновлён эмбед"})
    })
  }
}