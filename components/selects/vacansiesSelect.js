const { ChannelSelectMenuInteraction } = require("discord.js");
const { systemMessageModel, systemAnketa, systemAnketaQuestion, systemAnketaModalIDS } = require("../../models/system_message/models");
const {EmbedBuilder} = require('discord.js')
const sequelize = require('../../db')
const {baseModal} = require('../modals/baseExecute')


module.exports = {
  customId: "vacansiesSelect",

  /**
   * @param { ChannelSelectMenuInteraction } interaction
   */

  async execute(interaction) {
    const values = interaction.values[0];
    const question = await systemAnketaQuestion.findOne({where: {type: values}})
    await baseModal(values, question.dataValues.question1, question.dataValues.question2, interaction)
    
  }
};
