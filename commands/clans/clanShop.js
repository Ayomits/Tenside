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
                result.clanLevel + 1 > 10 ? "Максимальный уровень" : config.lvls[result.clanLevel + 1]
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

      await interaction.reply({embeds: [embed], components: [selectMenu]})

      interaction.channel.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
      }).on('collect', async (inter) => {
        if (inter.user.id === interaction.user.id) {
          const values = inter.values[0]
          switch (values) {
            case 'lvlUp':
                await lvlUp(inter, result)
                break;

              case "slots":
                
              }
        }   
      }) 
  }}
};


async function slots (result, config, ) {
  if (result.clanMaxSlots + 1 > 100) {
    return await inter.reply({content: "Невозможно купить слот. Вы достигли лимита", ephemeral: true})
  }
  if (result.clanBalance < config.slot) {
    return await inter.reply({content: "Невозможно купить слот. У клана нет баланса", ephemeral: true})
  }
  const modal = new ModalBuilder()
                .setTitle('Слоты в клан')
                .setCustomId('slots_'+inter.user.id)
                .setComponents(ActionRowBuilder().addComponents(
                  new TextInputBuilder().setLabel('Кол-во бустов').setCustomId('count')
                ))
  await inter.showModal(modal)
  inter.client.on('interactionCreate', async (i) => {
    if (i.isModalSubmit() && i.customId === 'slots_' + i.user.id) {
      
    }
  })
}


async function lvlUp (inter, result, config) {
  if (result.clanLevel + 1 > 10) {
    await inter.message.edit({ components: [] });
    return await inter.reply({
      content: 'Вам нельзя повысить уровень клана, т.к. у вас уже максимальный',
      ephemeral: true,
    });
    }
    if (result.clanBalance < config.lvls[result.clanLevel + 1]) {
      await inter.message.edit({ components: [] });
      return await inter.reply({
        content: 'У вашего клана недостаточно средств для совершения этой покупки',
        ephemeral: true,
      });
    } else {
      await clanModel.updateOne(
        { guild_id: inter.guildId, clanName: result.clanName },
        { $inc: { clanLevel: 1, clanBalance: config.lvls[result.clanLevel + 1] } }
      );
      await inter.message.edit({ components: [] });
      await inter.reply({ content: 'Вы повысили уровень своего клана', ephemeral: true });
    }
}