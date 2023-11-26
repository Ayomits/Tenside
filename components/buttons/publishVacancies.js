const {
  ButtonInteraction,
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} = require("discord.js");
const {
  systemMessageModel,
  systemAnketaEmbed,
  systemAnketaQuestion,
  systemAnketaModalIDS,
  systemAnketaRecrutChannel,
} = require("../../models/system_message/models");

module.exports = {
  customId: "publishVacancies",

  /**
   * @param {ButtonInteraction} interaction
   */

  async execute(interaction) {
    const channel_id = await systemMessageModel.findOne({
      where: {
        guild_id: interaction.guildId,
      },
    });
    if (channel_id) {
      const channelId = channel_id.dataValues.channel_id;
      const channel = interaction.guild.channels.cache.get(channelId);
      const fields = await systemAnketaEmbed.findOne({
        where: { guild_id: interaction.guildId },
      });
      if (fields) {
        const fields_ = fields.dataValues;
        const embed = new EmbedBuilder()
          .setTitle(fields_.title)
          .setDescription(fields_.description)
          .setColor(fields_.color)
          .setImage(fields_.imageLink);
        const select = new StringSelectMenuBuilder()
          .setCustomId("vacansiesSelect")
          .setPlaceholder("Выберите должность");

        const types = await systemAnketaQuestion.findAll();
        for (let i = 0; i < types.length; i++) {
          select.addOptions({
            label: types[i].dataValues.type,
            value: types[i].dataValues.type,
          });
        }
        try {
          await channel.send({
            components: [new ActionRowBuilder().addComponents(select)],
            embeds: [embed]
          });
        } catch {
          await interaction.reply({
            content: "неизвестная ошибка, видимо вы не создали вакансий",
          });
        }
      }
    }
  },
};
