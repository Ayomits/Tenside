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
  StringSelectMenuInteraction,
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

      await interaction.reply({ embeds: [embed], components: [selectMenu] });
      
      

      interaction.channel
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
                await slots(result, config, inter);

              case "customize":
                await customize();
            }
          }
        });
    }
  },
};

async function customize(inter) {}

/**
 * 
 * @param {*} result 
 * @param {*} config 
 * @param {StringSelectMenuInteraction} inter 
 */

async function slots(result, config, inter) {
  const randomNum = Math.random()
  const modal = new ModalBuilder()
    .setTitle("Слоты в клан")
    .setCustomId("slots_" + inter.user.id + String(randomNum));

  const componentAmount = new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setLabel("Кол-во слотов")
      .setCustomId("amount")
      .setStyle(TextInputStyle.Short)
  );
  modal.addComponents(componentAmount);
  await inter.showModal(modal);
  await slotsCallback(result, config, inter, String(randomNum))
}

async function slotsCallback (result, config, inter, randomNum) {
  inter.client.on("interactionCreate", async (i) => {
    if (i.isModalSubmit() && i.customId === "slots_" + i.user.id + randomNum) {
      const amount = i.fields.getField("amount").value;
      if (result.clanMaxSlots + Number(amount) > 100) {
        await i.message.edit({components: []})
        return await i.channel.send({
          content: "Невозможно купить слоты, превышение лимита",
          ephemeral: true,
        });
      }
      if (result.clanBalance < config.slot * Number(amount)) {
        await i.message.edit({components: []})
        return await i.channel.send({
          content: "Невозможно купить слот. У клана нет баланса",
          ephemeral: true,
        });
      }
      if (Number.isNaN(amount)) {
        await i.message.edit({components: []})
        return await i.channel.send({ content: "укажите число", ephemeral: true });
      } else {
        await clanModel.updateOne(
          { guild_id: i.guildId, clanName: result.clanName },
          {
            $inc: {
              clanBalance: -(amount * config.slot),
              clanMaxSlots: amount,
            },
          }
        );
        await i.message.edit({components: []})
        return await i.channel.send({ content: "Слоты успешно куплены" });
      }
    }
  });
}

async function lvlUp(inter, result, config) {
  if (result.clanLevel + 1 > 10) {
    await inter.message.edit({ components: [] });
    return await inter.reply({
      content: "Вам нельзя повысить уровень клана, т.к. у вас уже максимальный",
      ephemeral: true,
    });
  }
  if (result.clanBalance < config.lvls[result.clanLevel + 1]) {
    await inter.message.edit({ components: [] });
    return await inter.channel.send({
      content:
        "У вашего клана недостаточно средств для совершения этой покупки",
      ephemeral: true,
    });
  } else {
    await clanModel.updateOne(
      { guild_id: inter.guildId, clanName: result.clanName },
      { $inc: { clanLevel: 1, clanBalance: config.lvls[result.clanLevel + 1] } }
    );
    await inter.message.edit({ components: [] });
    await inter.channel.send({
      content: "Вы повысили уровень своего клана",
      ephemeral: true,
    });
  }
}
