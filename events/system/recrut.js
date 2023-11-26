const { Interaction, Client, Events } = require("discord.js");
const {systemAnketaModalIDS} = require('../../models/system_message/models')
const {execute} = require("../../components/modals/baseExecute")

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  /**
   * @param {Interaction} interaction
   * @param {Client} client
   */

  async execute(interaction) {

    if (interaction.isModalSubmit()) {
        await systemAnketaModalIDS.findOne({where: {customId: interaction.customId}}).then(async (result) => {  
        const modal = interaction.client.modals.get(result.dataValues.customId)
        if(!modal) return interaction.reply({ephemeral: true, content: "неизвестная ошибка модалок"})
        else await execute(interaction)
      }).catch((err) => {
        console.log(err);
      })
    }
  }
};