const { ModalSubmitInteraction } = require('discord.js');
const { systemAnketaQuestion, systemAnketaModalIDS, systemAnketa } = require('../../../models/system_message/models');

module.exports = {
  customId: 'questions',

  /**
   * @param {ModalSubmitInteraction} interaction
   */
  async execute(interaction) {
    const values = interaction.fields;
    const question1_ = values.getTextInputValue('question1');
    const question2_ = values.getTextInputValue('question2');
    const type_ = values.getTextInputValue('type');
    console.log(question1_, question2_, type_);
    await systemAnketaQuestion.create({type: type_, question1: question1_, question2: question2_}).then(async () => {
      systemAnketaModalIDS.create({customId: type_}).then(async () => {
        await interaction.reply({content: "успешно создано в базе данных", ephemeral: true})
      }).catch(async () => {
        await interaction.reply({content: "что-то пошло не так", ephemeral: true})
      })
    })
  },
};
