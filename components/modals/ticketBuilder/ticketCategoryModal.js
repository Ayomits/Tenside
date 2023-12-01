const {ModalSubmitInteraction} = require("discord.js")
const {TicketCategory} = require("../../../models/tickets")

module.exports = {
  customId: "ticketCategoryModal",

  /**
   *@param {ModalSubmitInteraction} interaction
   */

   async execute(interaction) {
    const categoryId = interaction.fields.getField("categoryId").value

    await TicketCategory.findOne({guild_id: interaction.guildId}).then(async (result) => {
      if (result === null) {
        await TicketCategory.create({guild_id: interaction.guildId, category_id: categoryId})
        await interaction.reply({content: "Успешно создана категория для тикетов", ephemeral: true})
      }else {
        await TicketCategory.updateOne({guild_id: interaction.guildId, category_id: categoryId})
        await interaction.reply({content: "Успешно обновлена категория для тикетов", ephemeral: true})
      }
    })
   }
}