const { SlashCommandBuilder } = require("@discordjs/builders");
const { clanModel } = require("../../models/clans");
const {
  CommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ComponentType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,

} = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop-clan")
    .setDescription("shop clan"),

  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const result = await clanModel.findOne({
      guild_id: interaction.guildId,
      clanMembers: { $elemMatch: { $in: [interaction.user.id] } },
    });

    if (result !== null) {
      const config = JSON.parse(
        await fs.promises.readFile(path.resolve("configs", "store.json"))
      );
      const embed = new EmbedBuilder().setTitle(
        `Магазин клана ${result.clanName}`
      )
        .setDescription(`При помощи меню ниже, вы сможете купить товар для вашего клана \n
                                    Помните, что **все товары** покупаются **за счёт баланса клана**!\n
                                    Пополнить баланс можно с помощью **/transfer-clan**`);

      const selectMenu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(interaction.user.id)
          .setPlaceholder("Выберите товар")
          .setOptions(
            {
              label: "Повысить уровень",
              value: "lvlUp",
              description: `${
                result.clanLevel + 1 > 10
                  ? "Максимальный уровень"
                  : config.lvls[result.clanLevel + 1]
              }`,
            },
            {
              label: "Купить слоты",
              value: "slots",
              description: `${config.slot}`,
            },
            {
              label: "Кастомизация клана",
              value: "customize",
              description: `${config.customize}`,
            }
          )
      );

      const msg = await interaction.reply({ embeds: [embed], components: [selectMenu] });
      
      msg
        .createMessageComponentCollector({
          componentType: ComponentType.StringSelect,
        })
        .on("collect", async (inter) => {
          if (inter.user.id === interaction.user.id) {
            const values = inter.values[0];
            switch (values) {
              case "lvlUp":
                await lvlUp(inter, result, config);
                break;

              case "slots":
                const modal = new ModalBuilder()
                  .setTitle("Слоты в клан")
                  .setCustomId("buySlots");

                const componentAmount = new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setLabel("Кол-во слотов")
                    .setCustomId("amount")
                    .setStyle(TextInputStyle.Short)
                );
                modal.addComponents(componentAmount);
                await inter.showModal(modal)
                break

              case "customize":
                const modalCustomize = new ModalBuilder().setTitle('Кастомизация клана').setCustomId('clanCustomize')
                const componentName = new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setLabel("Имя клана")
                    .setCustomId("clanName")
                    .setStyle(TextInputStyle.Short)
                    .setValue(result.clanName)
                );
                const componentAvatar = new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setLabel("Аватар клана")
                    .setCustomId("clanAvatar")
                    .setStyle(TextInputStyle.Short)
                    .setValue(result.clanAvatar)
                );
                const componentDesc = new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setLabel("Описание клана")
                    .setCustomId("clanDesc")
                    .setStyle(TextInputStyle.Paragraph)
                    .setValue(result.clanDesc)
                );
                const componentHex = new ActionRowBuilder().addComponents(
                  new TextInputBuilder()
                    .setLabel("Кол-во слотов")
                    .setCustomId("clanHex")
                    .setStyle(TextInputStyle.Short)
                    .setValue("#000000")
                    .setMaxLength(7)
                );

                modalCustomize.addComponents(componentName, componentDesc, componentHex, componentAvatar)
                await inter.showModal(modalCustomize)
                break
            }
          }
        });
    }else {
      await interaction.reply({content: "У вас нет клана", ephemeral: true})
    }
  },
};

async function lvlUp(inter, result, config) {
  if (result.clanLevel + 1 > 10) {
    return await inter.reply({
      content: "Вам нельзя повысить уровень клана, т.к. у вас уже максимальный",
      ephemeral: true,
    });
  }
  if (result.clanBalance < config.lvls[result.clanLevel + 1]) {
    return await inter.reply({
      content:
        "У вашего клана недостаточно средств для совершения этой покупки",
      ephemeral: true,
    });
  } else {
    await clanModel.updateOne(
      { guild_id: inter.guildId, clanName: result.clanName },
      { $inc: { clanLevel: 1, clanBalance: config.lvls[result.clanLevel + 1] } }
    );
    await inter.reply({
      content: "Вы повысили уровень своего клана",
      ephemeral: true,
    });
  }
}
