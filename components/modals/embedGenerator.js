const {ModalSubmitInteraction, EmbedBuilder} = require('discord.js')
const { systemAnketaEmbed } = require('../../models/system_message/models')

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
      imageLink: embedImage
    }).then(async () => {
      await interaction.reply({content: "успешно создан эмбед", ephemeral: true})
    }).catch(async () => {
      await systemAnketaEmbed.update({
        title: embedTitle,
        description: embedDescription,
        color: embedColor,
        imageLink: embedImage
      }, {where: {guild_id: interaction.guildId}})
      await interaction.reply({content: "успешно обновлён эмбед"})
    })
  }
}