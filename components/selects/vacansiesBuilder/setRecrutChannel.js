const {
  ButtonInteraction,
} = require("discord.js");
const {
  systemAnketaRecrutChannel
} = require("../../../models/system_message");
const {setChannel} = require("../../../functions/setChannel")


module.exports = {
  customId: "setRecrutChannel",

  /**
   * @param {ButtonInteraction} interaction
   */

  async execute(interaction) {
    await setChannel (interaction, systemAnketaRecrutChannel, "вакансий")
  }
}