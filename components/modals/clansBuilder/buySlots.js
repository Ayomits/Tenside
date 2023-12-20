const { ModalSubmitInteraction } = require("discord.js");
const { clanModel } = require("../../../models/clans");
const fs = require("fs");
const path = require("path");


module.exports = {
  customId: "buySlots",

  /**
   * 
   * @param {ModalSubmitInteraction} interaction 
   */

  async execute(interaction) {
    const config = JSON.parse(await fs.promises.readFile(path.resolve('configs', 'store.json')))
    const result = await clanModel.findOne({
      guild_id: interaction.guildId,
      clanMembers: { $elemMatch: { $in: [interaction.user.id] } },
    });

    const amount = interaction.fields.getField("amount").value;

    if (result.clanLevel < 5) {
      return await interaction.reply({content: "У клана низкий лвл. Требуется 5й", ephemeral: true})
    }

    if (result.clanMaxSlots + Number(amount) > 100) {
      return await interaction.reply({
        content: "Невозможно купить слоты, превышение лимита",
        ephemeral: true,
      });
    }
    if (result.clanBalance < config.slot * Number(amount)) {
      return await interaction.reply({
        content: "Невозможно купить слот. У клана нет баланса",
        ephemeral: true,
      });
    }
    if (Number.isNaN(amount)) {
      return await interaction.reply({ content: "укажите число", ephemeral: true });
    } else {
      await clanModel.updateOne(
        { guild_id: interaction.guildId, clanName: result.clanName },
        {
          $inc: {
            clanBalance: -(amount * config.slot),
            clanMaxSlots: amount,
          },
        }
      );
      return await interaction.reply({ content: "Слоты успешно куплены" });
    }
  }
}