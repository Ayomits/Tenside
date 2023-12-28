const { SlashCommandBuilder } = require("@discordjs/builders");
const { clanModel } = require('../../models/clans');
const { CommandInteraction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('transfer-ownership-clan')
    .setDescription('передача овнерки клана')
    .addUserOption(option => option.setName('target').setDescription('target user').setRequired(true)),

  /**
   *
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const targetUser = interaction.options.getMember('target');

    const result = await clanModel.findOne({ guild_id: interaction.guildId, clanOwner: interaction.user.id });

    if (result !== null) {
      const updateData = {
        clanOwner: targetUser.user.id,
      };

      if (result.clanDeputy.includes(targetUser.user.id)) {
        updateData['$pull'] = { clanDeputy: targetUser.user.id };
        updateData['$push'] = { clanDeputy: interaction.user.id }
      }

      await clanModel.updateOne({ guild_id: interaction.guildId, clanName: result.clanName }, updateData);

      try {
        await targetUser.send(`Поздравляем! Вы стали владельцем клана ${result.clanName}`);
      } catch (err) {
        await interaction.channel.send({ content: `<@${targetUser.user.id}> поздравляю, вы стали владельцем клана ${result.clanName}` });
      }

      return await interaction.reply({ content: "Вы успешно передали права владельца", ephemeral: true });
    } else {
      return await interaction.reply({ content: "Вы не являетесь владельцем ни одного клана", ephemeral: true });
    }
  }
};