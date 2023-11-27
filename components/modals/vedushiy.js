const { ModalSubmitInteraction } = require('discord.js');


module.exports = {
  customId: 'vedushiy',

  /**
   * @param {ModalSubmitInteraction} interaction
   */
  async execute(interaction) {
    await interaction.reply({content: "ну вроде всё ок"})
    console.log(interaction.fields);
  },
};
