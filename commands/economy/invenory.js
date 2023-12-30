const {
  CommandInteraction,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  Collector,
  StringSelectMenuBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { userModel } = require("../../models/users");
const { inventoryModel } = require("../../models/users");
const { ShopRoleModel } = require("../../models/shop");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inventory")
    .setDescription("проверка инвентаря"),
  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const user = interaction.user;

    // Получаем инвентарь пользователя
    const inventory = await inventoryModel.findOne({
      guild_id: interaction.guildId,
      user_id: user.id,
    });

    // Получаем роли пользователя
    const member =
      interaction.guild.members.cache.get(user.id) ||
      (await interaction.guild.members.fetch(user.id));
    const userRoles = member?.roles.cache;

    // Получаем роли из магазина ролей
    const shopRoles = await ShopRoleModel.find({
      guild_id: interaction.guild.id,
    });

    // Сортируем роли из инвентаря по их позиции (index)
    const inventoryRoles = shopRoles
      .filter((role) => inventory?.inventory.includes(role.roleId))
      .sort((a, b) => a.index - b.index);

    // Сортируем роли из магазина ролей, которые есть у пользователя, по их позиции (index)
    const userShopRoles = shopRoles
      .filter((role) => userRoles?.has(role.roleId))
      .sort((a, b) => a.index - b.index);

    // Создаем строку с ролями из инвентаря
    const inventoryRolesString = inventoryRoles
      .map((role, index) => `${index + 1}) <@&${role.roleId}>`)
      .join("\n");

    // Создаем строку с ролями из магазина ролей, которые есть у пользователя
    const userShopRolesString = userShopRoles
      .map((role, index) => `${index + 1}) <@&${role.roleId}>`)
      .join("\n");

    // Создаем Embed
    const embed = new EmbedBuilder().setTitle(
      `Инвентарь пользователя - ${user.tag}`
    );

    // Добавляем описание с ролями из инвентаря и ролями пользователя
    embed.setDescription(
      `**Роли из инвентаря:**\n${
        inventoryRolesString || "Нет ролей из инвентаря"
      }\n\n**Роли пользователя:**\n${
        userShopRolesString || "Пользователь не имеет ролей из магазина"
      }`
    );
    const buttonadd = new ButtonBuilder()
      .setCustomId(`add`)
      .setLabel(`Добавить роль`)
      .setStyle(ButtonStyle.Success)
      .setDisabled(inventoryRoles == 0);

    const buttonremove = new ButtonBuilder()
      .setCustomId(`remove`)
      .setLabel(`Убрать роль`)
      .setStyle(ButtonStyle.Danger)
      .setDisabled(userShopRoles == 0);
    const row = new ActionRowBuilder().setComponents(buttonadd, buttonremove);
    const filter = (interaction) => {
      interaction.deferUpdate();
      return interaction.user.id === user.id;
    };

    const msg = await interaction.reply({ embeds: [embed], components: [row] });
    const collector = msg.createMessageComponentCollector({ filter });
    collector.on("collect", async (interaction) => {
      if (interaction.customId == `add`) {
        const addSelectMenu = new StringSelectMenuBuilder()
          .setCustomId("addRoles")
          .setPlaceholder("Выберите роли для добавления");
        inventoryRoles.forEach((role) => {
          const option = {
            label: interaction.guild.roles.cache.find(
              (r) => r.id === role.roleId
            ).name,
            value: role.roleId,
          };
          addSelectMenu.addOptions([option]);
        });
        const row1 = new ActionRowBuilder().setComponents(addSelectMenu);
        await interaction.message.edit({ components: [row1] });
      } else if (interaction.customId == `remove`) {
        const addSelectMenu = new StringSelectMenuBuilder()
          .setCustomId("removeRoles")
          .setPlaceholder("Выберите роли для удаления");
        userShopRoles.forEach((role) => {
          const option = {
            label: interaction.guild.roles.cache.find(
              (r) => r.id === role.roleId
            ).name,
            value: role.roleId,
          };
          addSelectMenu.addOptions([option]);
        });
        const row1 = new ActionRowBuilder().setComponents(addSelectMenu);
        await interaction.message.edit({ components: [row1] });
      } else if (interaction.customId == `removeRoles`) {
        const rol = interaction.values[0];
        await interaction.member.roles.remove(rol);

        await inventoryModel.updateOne(
          { guild_id: interaction.guildId, user_id: interaction.user.id },
          { $push: { inventory: rol } }
        );
        await interaction.message.edit({
          content: `Роль была добавлена в инвентарь!`,
          embeds: [],
          components: [],
        });
      } else if (interaction.customId == `addRoles`) {
        const rol = interaction.values[0];
        await interaction.member.roles.add(rol);

        await inventoryModel.updateOne(
          { guild_id: interaction.guildId, user_id: interaction.user.id },
          { $pull: { inventory: rol } }
        );

        await interaction.message.edit({
          content: `Роль успешно выданна!`,
          embeds: [],
          components: [],
        });
      }
    });
  },
};
