const { CommandInteraction, EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ShopRoleModel } = require("../../models/shop");
const devs = JSON.parse(process.env.DEVELOPERS);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shoprem")
    .setDescription("Удалить роль из магазина")
    .addRoleOption((option) =>
      option.setName("role").setDescription("Роль").setRequired(true)
    ),

  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    if (
      devs.includes(String(interaction.user.id)) ||
      interaction.member.permissions.has(8n)
    ) {
      const selectedRole = interaction.options.getRole("role");

      const role = await ShopRoleModel.findOne({
        guild_id: interaction.guildId,
        roleId: selectedRole.id,
      });
      if (role) {
        await ShopRoleModel.deleteOne({
          guild_id: interaction.guildId,
          roleId: selectedRole.id,
        }).then(async () => {
          await interaction.reply({
            content: `Роль ${selectedRole} была удалена из магазина!`,
            ephemeral: true,
          });
        });
      } else
        await interaction.reply({
          content: `Роли ${selectedRole} не существует в магазине!`,
          ephemeral: true});
    } else {
      return interaction.reply({ ephemeral: true, content: `Недоступно!` });
    }
  },
};
