const {ModalSubmitInteraction} = require("discord.js")
const {TicketSettingsTheme} = require('../../../models/tickets')


module.exports = {
  customId: "themeDeleteModal",

  /**
   *@param {ModalSubmitInteraction} interaction
   */
  
   async execute(interaction) {
    const themeId = interaction.fields.getField('themeId').value

    await TicketSettingsTheme.findOne({theme_uniq_id: themeId.toLowerCase(), guild_id: interaction.guildId}).then(async (result) => {
      if (result === null) {
        await interaction.reply({content: "Тема с этим id ещё не создана", ephemeral: true})
      }else {
        await TicketSettingsTheme.deleteOne({theme_uniq_id: themeId.toLowerCase(), guild_id: interaction.guildId})
        await interaction.reply({content: `Тема с id - ${themeId.toLowerCase()} успешно удалена`, ephemeral: true})
      }
    })
   }
}