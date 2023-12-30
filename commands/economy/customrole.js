const { CommandInteraction, EmbedBuilder, Permissions } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ShopRoleModel } = require("../../models/shop");
const customRoleSettingsSchema = require(`../../models/shop`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shopaddcustomrole")
    .setDescription("Добавить роль в магазин")
    .addIntegerOption((option) =>
      option
        .setName("price")
        .setDescription("Цена")
        .setMinValue(1)
        .setRequired(true)
    ),

  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const Embed = new EmbedBuilder()
      .setTitle(`Магазин ролей сервера ${interaction.guild.name}`)
      .setImage("https://i.imgur.com/i3Y3gQF.png")

      .setThumbnail(interaction.guild.iconURL());
    const settingsRoleId = "1185625362986709143";
    const price = interaction.options.getInteger("price");

    try {
      const settingsRole = interaction.guild.roles.cache.find(
        (r) => r.id === settingsRoleId
      );

      if (!settingsRole) {
        return interaction.reply({
          ephemeral: true,
          content: "Указанная настройка роли не найдена.",
        });
      }

      const check =
        await customRoleSettingsSchema.CustomRoleSettingsModel.findOne({
          guild_id: interaction.guild.id,
        });
      if (check) {
        await customRoleSettingsSchema.CustomRoleSettingsModel.updateOne(
          { guild_id: interaction.guild.id },
          { price: price }
        );
        return await interaction.reply({
          embeds: [Embed.setDescription("Цена личной роли была изменена!")],
          ephemeral: true,
        });
      }
      const createdRole = await interaction.guild.roles.create({
        name: "Кастомная роль",
        color: "#000000",
        reason: `Кастомная роль на 30д`,
        position: settingsRole.position,
      });

      await customRoleSettingsSchema.CustomRoleSettingsModel.create({
        guild_id: interaction.guild.id,
        roleId: createdRole.id,
        price: price,
      });

      await interaction.reply({
        embeds: [Embed.setDescription("Личная роль была добавлена в магазин!")],
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        ephemeral: true,
        content: "Произошла ошибка при выполнении команды.",
      });
    }
  },
};
