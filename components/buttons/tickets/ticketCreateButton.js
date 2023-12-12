const {
  CurrentTicket,
  TicketSettingsTheme,
  TicketCategory,
} = require("../../../models/tickets");
const {
  ButtonInteraction,
  EmbedBuilder,
  ComponentType,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  customId: "ticketCreate",

  /**
   * @param {ButtonInteraction} interaction
   */

  async execute(interaction) {
    try {
      const result = await CurrentTicket.findOne({
        guild_id: interaction.guildId,
        ticket_creator_id: interaction.user.id,
      });
      if (result === null) {
        let newChannel;
        const category = await TicketCategory.findOne({
          guild_id: interaction.guildId,
        });
        if (category) {
          newChannel = await interaction.guild.channels.create({
            name: `Тикет пользователя ${interaction.user.username}`,
            parent: category.category_id,
            position: 0,
            nsfw: false,
          });
        } else {
          await interaction.reply({
            content: `У вас уже имеется тикет в канале <@${result.channel_id}>`,
            ephemeral: true,
          });
        }

        await CurrentTicket.create({
          guild_id: interaction.guildId,
          channel_id: newChannel.id,
          ticket_creator_id: interaction.user.id,
        });
        await this.setPerms(newChannel, interaction);

        const embed = new EmbedBuilder()
          .setTitle(`Система поддержки сервера ${interaction.guild.name}`)
          .setDescription(
            `Итак, вы создали канал. На этом этапе вам нужно выбрать тему тикета и задать свой вопрос. Будьте внимательны и выбирайте темы с умом!`
          )
          .setFooter({
            text: `Поддержка ${interaction.guild.name}`,
            iconURL:
              interaction.guild.iconURL() ||
              "https://i.pinimg.com/736x/45/d5/d1/45d5d164a1dde1895a070571251ff756.jpg",
          });
        const closeTicket = new ButtonBuilder()
          .setCustomId("closeTicket")
          .setLabel("Закрыть тикет")
          .setStyle(ButtonStyle.Danger);

        const selectMenuBuilder = new StringSelectMenuBuilder()
          .setCustomId(interaction.user.id)
          .setPlaceholder("Выберите тему");

        const selectMenu = new ActionRowBuilder().addComponents(
          selectMenuBuilder
        );
        const themes = await TicketSettingsTheme.find({
          guild_id: interaction.guildId,
        });

        if (themes) {
          themes.forEach(async (theme) =>
            selectMenuBuilder.addOptions({
              label: theme.theme_title,
              description: theme.theme_desc,
              value: theme.theme_uniq_id,
            })
          );
        }

        await interaction.reply({
          content: "Ваш тикет в канале " + `<#${newChannel.id}>`,
          ephemeral: true,
        });
        await newChannel.send({
          content: `<@${interaction.user.id}>`,
          embeds: [embed],
          components: [
            selectMenu,
            new ActionRowBuilder().addComponents(closeTicket),
          ],
        });

        newChannel
          .createMessageComponentCollector({
            componentType: ComponentType.Button,
          })
          .on("collect", async (inter) => {
            if (inter.customId === "closeTicket") {
              await this.deleteChannel(inter, inter.channel)
            }
          });

        const collector = newChannel.createMessageComponentCollector({
          componentType: ComponentType.StringSelect,
        });

        collector.once("collect", async (inter) => {
          const value = inter.values[0];
          const theme_ = await TicketSettingsTheme.findOne({
            theme_uniq_id: value,
          });
          const spited_pinged_roles = theme_.pinged_roles.split(" ");
          let message_content = "";

          spited_pinged_roles.forEach(
            (role) => (message_content += `<@&${role}>`)
          );
          embed.setDescription(
            "Ваш ответ записан. Теперь напишите свою жалобу"
          );
          embed.setFooter({
            iconURL:
              inter.guild.iconURL() ||
              "https://i.pinimg.com/736x/45/d5/d1/45d5d164a1dde1895a070571251ff756.jpg",
            text: "Выбранная тема: " + value,
          });
          await inter.message.edit({ embeds: [embed], components: [] });

          const messageCollector = await newChannel.createMessageCollector({});

          await newChannel.permissionOverwrites.edit(inter.user, {
            SendMessages: true,
          });

          messageCollector.once("collect", async (message) => {
            await this.onMessage(newChannel, inter, spited_pinged_roles, message, message_content)
          });
        });
      } else {
        await interaction.reply({
          content: `У вас уже создан тикет в канале <#${result.channel_id}>`,
          ephemeral: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  async setPerms(channel, interaction) {
    Promise.all([
      await channel.permissionOverwrites.create(
        interaction.guild.roles.everyone,
        {
          ViewChannel: false,
        }
      ),
      await channel.permissionOverwrites.create(interaction.user, {
        ViewChannel: true,
        SendMessages: false,
      }),
    ]);
  },

  async deleteChannel(interaction, channel) {
    await CurrentTicket.deleteOne({
      guild_id: interaction.guildId,
      channel_id: channel.id,
    });
    await channel.delete();
  },
  async onMessage(newChannel, inter, spited_pinged_roles, message, message_content) {
    const embed_ = new EmbedBuilder()
                  .setTitle("Система поддержки")
                  .setDescription("Примите тикет");
    const AcceptTiket = new ButtonBuilder()
                      .setCustomId("acceptBtn")
                      .setLabel("принять тикет")
                      .setStyle(ButtonStyle.Success);
    try {
      spited_pinged_roles.forEach(async (role) => {
        try {
          await newChannel.permissionOverwrites.create(role, {
            ViewChannel: true,
          });
        } catch (error) {
          // Обработка ошибок при создании разрешений для роли
          console.error(
            `Ошибка при создании разрешений для роли ${role}:`,
            error
          );
          await inter.channel.send(`<@${inter.user.id}> канал будет удалёна в связи с тем, что не найден отвечающий для этой темы`)
          setTimeout(async () => {
            if (!newChannel.deleted) {
              // Удаление канала после 5 секунд
              try {
                await this.deleteChannel(inter, inter.channel)
              } catch (error) {
                console.error("Ошибка при удалении канала:", error);
              }
            }
          }, 5000); // 5 секунд задержки
        }
      });
      
    } catch (error) {
      console.error("Ошибка при обработке ролей:", error);
      await newChannel.delete();
    }
    await message.channel.send({
      content: message_content,
      embeds: [embed_],
      components: [new ActionRowBuilder().addComponents(AcceptTiket)],
    });
  }
};
