const {
  CommandInteraction,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  EmbedBuilder,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ShopRoleModel, CustomRoleSettingsModel } = require("../../models/shop");
const { userModel, inventoryModel } = require("../../models/users");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Показать доступные роли на сервере"),

  async execute(interaction) {
    const user = interaction.user.id;

    try {
      const rolesPerPage = 5;
      let page = interaction.options.getInteger("page") || 1;

      const roles = await ShopRoleModel.find({ guild_id: interaction.guild.id })
        .sort({ price: 1 })
        .skip((page - 1) * rolesPerPage)
        .limit(rolesPerPage);
      const allroles = await ShopRoleModel.find({
        guild_id: interaction.guild.id,
      });
      if (roles.length === 0) {
        await interaction.reply({
          content: `В магазине нет доступных ролей на странице ${page}.`,
          ephemeral: true,
        });
        return;
      }

      const roleDescriptions = roles.map(
        (role, index) =>
          `**${index + 1})** <@&${role.roleId}>\n**Цена:** ${
            role.price
          }${process.env.MONEY_STICKER}\n**Куплена раз:** ${role.buyed}`
      );

      const roleSelectMenu = new StringSelectMenuBuilder()
        .setCustomId("roleSelect")
        .setPlaceholder("Выберите роль для покупки")
        .addOptions(
          roles.map((role, index) => ({
            label: ` ${index + 1}) ${
              interaction.guild.roles.cache.find((r) => r.id === role.roleId)
                .name
            }`,
            value: role.roleId,
            emoji: `🏷`,
            description: `Цена: ${role.price}`,
          }))
        );

      const selectMenuRow = new ActionRowBuilder().addComponents(
        roleSelectMenu
      );

      const specialOfferButton = new ButtonBuilder()
        .setCustomId("specialOffer")
        .setEmoji("🚀")
        .setStyle(ButtonStyle.Success)
        .setDisabled(true);

      const prevButton = new ButtonBuilder()
        .setCustomId("prev")
        .setEmoji(`◀`)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(page == 1); // Disable if on the first page

      const nextButton = new ButtonBuilder()
        .setCustomId("next")
        .setEmoji(`▶`)
        .setStyle(ButtonStyle.Primary);

      const buttonRow = new ActionRowBuilder().addComponents(
        specialOfferButton,
        prevButton,
        nextButton
      );

      const embed = new EmbedBuilder()
        .setTitle(`Магазин ролей сервера ${interaction.guild.name}`)
        .setImage("https://i.imgur.com/i3Y3gQF.png")
        .setDescription(
          `Выберите роль для покупки:\n\n${roleDescriptions.join("\n\n")}`
        )
        .setThumbnail(interaction.guild.iconURL());

      const message = await interaction.reply({
        embeds: [
          embed.setFields({
            name: `\u200b`,
            inline: true,
            value: `Страница: ${page}`,
          }),
        ],
        components: [selectMenuRow, buttonRow],
        ephemeral: false,
      });

      const filter = (interaction) => {
        interaction.deferUpdate();
        return (
          (interaction.customId === "prev" ||
            interaction.customId === "next" ||
            interaction.customId === "roleSelect" ||
            interaction.customId === "specialOffer") &&
          interaction.user.id === user
        );
      };

      const collector = message.createMessageComponentCollector({ filter });
      const privaterole = await CustomRoleSettingsModel.findOne({
        guild_id: interaction.guild.id,
      });
      collector.on("collect", async (interaction) => {
        if (interaction.customId === `specialOffer`) {
          const SpecialEmbed = new EmbedBuilder()
            .setTitle(
              `Спецальные предложения сервера ${interaction.guild.name}`
            )
            .setImage("https://i.imgur.com/i3Y3gQF.png")
            .setDescription(
              `<@&${privaterole.roleId}>\n**Цена:** ${privaterole.price} ${process.env.MONEY_STICKER}\n**Куплена раз:** ${privaterole.buyed}\n**Срок:** 30д\n\n **Подарок🎁**\n**Цена:** 200 ${process.env.MONEY_STICKER}`
            )
            .setThumbnail(interaction.guild.iconURL());

          return await interaction.message.edit({
            components: [],
            embeds: [SpecialEmbed],
          });
        } else if (
          (interaction.customId === "prev" ||
            interaction.customId === "previos") &&
          page > 1
        ) {
          page--;
        } else if (interaction.customId === "next") {
          // Check if you're already on the last page
          if (roles.length < rolesPerPage) {
            return;
          }

          try {
            page++;
          } catch (error) {
            return;
          }
        } else if (interaction.customId === "roleSelect") {
          const Member = await inventoryModel.findOne({
            guild_id: interaction.guildId,
            user_id: interaction.user.id,
          });
          if (!Member) {
            await inventoryModel.create({
              guild_id: interaction.guildId,
              user_id: interaction.user.id,
            });
          }

          const selectedRoleId = interaction.values[0];
          const userinfo = await userModel.findOne({
            user_id: user,
            guild_id: interaction.guild.id,
          });
          const role = await ShopRoleModel.findOne({
            guild_id: interaction.guild.id,
            roleId: selectedRoleId,
          });

          const inventoryhaverole = await inventoryModel.findOne({
            guild_id: interaction.guildId,
            user_id: interaction.user.id,
            inventory: { $in: [role.roleId] },
          });
          const rolegive = interaction.guild.roles.cache.find(
            (r) => r.id === role.roleId
          );
          const errembed = new EmbedBuilder()
            .setTitle(`Магазин ролей сервера ${interaction.guild.name}`)
            .setImage("https://i.imgur.com/i3Y3gQF.png")

            .setThumbnail(interaction.guild.iconURL());

          if (
            inventoryhaverole ||
            interaction.member.roles.cache.find((r) => r.id === role.roleId)
          ) {
            return await interaction.message.edit({
              components: [],
              embeds: [errembed.setDescription(`У вас уже есть данная роль!`)],
            });
          }
          if (!userinfo) {
            return await interaction.message.edit({
              components: [],
              embeds: [
                errembed.setDescription(
                  `Произошла неведанная ошибка! попробуйте снова`
                ),
              ],
            });
          }
          if (userinfo.balance < role.price) {
            return await interaction.message.edit({
              components: [],
              embeds: [
                errembed.setDescription(
                  `У вас недостаточно денег! вас баланс: ${Math.floor(
                    userinfo.balance
                  )} ${process.env.MONEY_STICKER}`
                ),
              ],
            });
          } else {
            try {
              await inventoryModel.updateOne(
                { guild_id: interaction.guildId, user_id: interaction.user.id },
                { $push: { inventory: rolegive.id } }
              );
              userinfo.balance -= role.price;
              userinfo.save();
              role.buyed += 1;
              role.save();

              const buyembed = new EmbedBuilder()
                .setTitle(`Магазин ролей сервера ${interaction.guild.name}`)
                .setImage("https://i.imgur.com/i3Y3gQF.png")
                .setThumbnail(interaction.guild.iconURL())
                .setDescription(
                  `Поздравляем ${interaction.user.username} с покупкой роли ${rolegive}!`
                );
              return await interaction.message.edit({
                components: [],
                embeds: [buyembed],
              });
            } catch (error) {
              console.error(error);
              return;
            }
          }
        }

        const updatedRoles = await ShopRoleModel.find({
          guild_id: interaction.guild.id,
        })
          .sort({ price: 1 })
          .skip((page - 1) * rolesPerPage)
          .limit(rolesPerPage);

        const updatedRoleDescriptions = updatedRoles.map(
          (role, index) =>
            `**${index + 1})** <@&${role.roleId}>\n**Цена:** ${
              role.price
            }${process.env.MONEY_STICKER}\n**Куплена раз:** ${role.buyed}`
        );

        const NEWprevButton = new ButtonBuilder()
          .setCustomId("prev")
          .setEmoji(`◀`)
          .setStyle(ButtonStyle.Primary)
          .setDisabled(page == 1); // Disable if on the first page

        const updatedSelectMenu = new StringSelectMenuBuilder()
          .setCustomId("roleSelect")
          .setPlaceholder("Выберите роль для покупки")
          .addOptions(
            updatedRoles.map((role, index) => ({
              label: `${index + 1}) ${
                interaction.guild.roles.cache.find((r) => r.id === role.roleId)
                  .name
              }`,
              value: role.roleId,
              description: `Цена: ${role.price}`,
              emoji: `🏷`,
            }))
          );

        const NewROW = new ActionRowBuilder().addComponents(
          specialOfferButton,
          NEWprevButton,
          nextButton
        );

        // Clear components and add new ones
        selectMenuRow.components.length = 0;
        selectMenuRow.addComponents(updatedSelectMenu);
        const updatedEmbed = new EmbedBuilder()
          .setTitle(`Магазин ролей сервера ${interaction.guild.name}`)
          .setImage("https://i.imgur.com/i3Y3gQF.png")
          .setDescription(
            `Выберите роль для покупки:\n\n${updatedRoleDescriptions.join(
              "\n\n"
            )}`
          )
          .setThumbnail(interaction.guild.iconURL());
        // Check the length of components and adjust as needed
        if (selectMenuRow.components.length > 5) {
          selectMenuRow.components = selectMenuRow.components.slice(0, 5);
        }

        // Similarly for NewROW
        if (NewROW.components.length > 5) {
          NewROW.components = NewROW.components.slice(0, 5);
        }

        try {
          await interaction.message.edit({
            embeds: [
              updatedEmbed.setFields({
                name: `\u200b`,
                inline: true,
                value: `Страница: ${page}`,
              }),
            ],
            components: [selectMenuRow, NewROW],
          });
        } catch (error) {
          return page--;
        }
      });
    } catch (error) {
      console.error(error);
      await interaction.followUp({
        content: "Произошла ошибка при выполнении команды.",
        ephemeral: true,
      });
    }
  },
};
