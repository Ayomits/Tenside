const { ChannelSelectMenuInteraction } = require("discord.js");
const { systemMessageModel } = require("../../../models/system_message")
const {setChannel} = require('../../../functions/setChannel')


module.exports = {
  customId: "selectVacanciesChannel",

  /**
   * @param { ChannelSelectMenuInteraction } interaction
   */

  async execute(interaction) {
    await setChannel(interaction, systemMessageModel, "вакансий")
  }
};
