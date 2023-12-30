const { CommandInteraction, EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ShopRoleModel } = require("../../models/shop");
const img = `https://i.imgur.com/i3Y3gQF.png`;
const devs = JSON.parse(process.env.DEVELOPERS);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shopadd")
    .setDescription("Добавить роль в магазин")
    .addIntegerOption((option) =>
      option
        .setName("price")
        .setDescription("Цена")
        .setMinValue(1)
        .setRequired(true)
    )
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
      const price = interaction.options.getInteger(`price`);

      const embed = new EmbedBuilder()
        .setTitle(`Магазин ролей сервера ${interaction.guild.name}`)
        .setImage(img);
      const role = await ShopRoleModel.findOne({
        guild_id: interaction.guildId,
        roleId: selectedRole.id,
      });
      if (!role) {
        await ShopRoleModel.create({
          guild_id: interaction.guildId,
          roleId: selectedRole.id,
          price: price,
        }).then(async () => {
          await interaction.reply({
            content: `Роль ${selectedRole} была добавленна в магазин!`,
            ephemeral: true,
          });
        });
      } else
        await interaction.reply({
          content: `Роль ${selectedRole} Уже существует в магазине!`,
        });
    } else {
      return interaction.reply({ ephemeral: true, content: `Недоступно!` });
    }
  },
};
