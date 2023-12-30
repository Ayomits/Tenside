const {
  CommandInteraction, EmbedBuilder, ActionRowBuilder, TextInputBuilder, ButtonBuilder, ButtonStyle, ComponentType
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {clanModel} = require('../../models/clans')


module.exports = {
  data: new SlashCommandBuilder()
        .setName('newdeputy-clan')
        .setDescription('пригласить в клан')
        .addUserOption(option => 
              option.setName('target').setDescription('target user').setRequired(true))
        .addStringOption(option => 
                option.setName('type').setDescription('type of ').setRequired(true).addChoices({
                  name: "повысить",
                  value: "increase"
                },
                {
                  name: "понизить",
                  value: "disincrease"
                })),
  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    await interaction.deferReply()
    const targetUser = interaction.options.getMember('target');
    const type = interaction.options.get('type').value;
    
    const canIncrease = await clanModel.findOne({
    clanOwner: interaction.user.id
    });
    
    if (canIncrease) {
    try {
    const isDeputy = canIncrease.clanDeputy.includes(targetUser.user.id);
    const isMember = canIncrease.clanMembers.includes(targetUser.user.id);
    
      if (type === 'increase' && !isDeputy && isMember) {
        await clanModel.updateOne(
          { guild_id: interaction.guildId, clanName: canIncrease.clanName },
          { $push: { clanDeputy: targetUser.user.id } }
        );
    
        const successMessage = `Поздравляем! Вы стали заместителем клана ${canIncrease.clanName}`;
    
        try {
          await targetUser.send(successMessage);
        } catch (err) {
          await interaction.channel.send({ content: `<@${targetUser.user.id}> поздравляю, вы стали заместителем клана ${canIncrease.clanName}` });
        }
        
        await interaction.followUp({ content: "Заместитель успешно назначен", ephemeral: true });
      } else if (type === 'decrease' && isDeputy && isMember) {
        await clanModel.updateOne(
          { guild_id: interaction.guildId, clanName: canIncrease.clanName },
          { $pull: { clanDeputy: targetUser.user.id } }
        );
    
        const successMessage = `Вы больше не являетесь заместителем клана ${canIncrease.clanName}`;
    
        try {
          await targetUser.send(successMessage);
        } catch (err) {
          await interaction.channel.send({ content: `<@${targetUser.user.id}>, вы больше не являетесь заместителем клана ${canIncrease.clanName}` });
        }
    
        await interaction.followUp({ content: "Заместитель успешно снят", ephemeral: true });
      } else {
        await interaction.followUp({ content: "Что-то пошло не так. Возможные причины: Этого заместителя уже есть в вашем клане, либо такого участника нет в вашем клане", ephemeral: true });
      }
    } catch (err) {
      await interaction.followUp({ content: "Что-то пошло не так.." + `\n${err}`, ephemeral: true });
    }
  }
}
}