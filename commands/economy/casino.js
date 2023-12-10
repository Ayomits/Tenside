const { CommandInteraction, EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { userModel } = require("../../models/users");


module.exports = {
  data: new SlashCommandBuilder()
    .setName("casino")
    .setDescription("Игра в казино!")
    .addIntegerOption((option) =>
      option.setName("bid").setDescription("Ваша ставка").setRequired(true)
    ),

  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    const bid = interaction.options.getInteger("bid");
    const number = Math.floor(Math.random() * 2);

    const intUser = await userModel.findOne({
      guild_id: interaction.guild.id,
      user_id: interaction.user.id,
    });

    // Some IFs to check user balance and bid

    const balanceEmbed = new EmbedBuilder()
      .setTitle(`Ошибка!`)
      .setDescription(
        `**❌ У вас недостаточно валюты на счету. Ваш баланс:** \`${intUser.balance}\` <:solana:1183097799756238858> ❌`
      )
      .setColor("#db2518")
      .setFooter({
        iconURL: interaction.user.avatarURL(),
        text: interaction.user.username,
      });

    const existEmbed = new EmbedBuilder()
      .setTitle(`Ошибка!`)
      .setDescription(
        `**❌ Вы не можете поставить отрицательное число валюты. ❌**`
      )
      .setColor("#db2518")
      .setFooter({
        iconURL: interaction.user.avatarURL(),
        text: interaction.user.username,
      })
      .setTimestamp(new Date());

    if (bid <= 0) {
      return await interaction.reply({
        embeds: [existEmbed],
        ephemeral: true,
      });
    }

    if (bid > intUser.balance) {
      return await interaction.reply({
        embeds: [balanceEmbed],
        ephemeral: true,
      });
    }

    if (number == 0) {
      // const winmoney = bid * 1.5
      const wincolor = Math.floor(Math.random() * 7);
      const wincolorarray =
        (bid / intUser.balance) * 100 >= 70 ? [1] : [1, 2];

      // Win, lose embeds

      if (wincolorarray.includes(wincolor)) {
        const winmoney = bid * 2;
        const wingreen = new EmbedBuilder()
          .setTitle(`Вы выйграли!`)
          .setDescription(
            `**Вам выпал зелёный цвет. Ваша ставка удваивается. Вы выйграли** \`${winmoney}\` **<:solana:1183097799756238858> у диллера. Деньги автоматически поступят вам на счёт.**`
          )
          .setColor("#3ab03c")
          .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/1/11/Pan_Green_Circle.png")
          .setFooter({
            iconURL: interaction.user.avatarURL(),
            text: interaction.user.username,
          })
          .setTimestamp(new Date());

        await interaction.reply({ embeds: [wingreen] });
        await userModel.updateOne(
          {
            guild_id: interaction.guild.id,
            user_id: interaction.user.id,
          },
          {
            balance: intUser.balance + winmoney,
          }
        );
      } else {
        const winmoney = bid * 1.5;
        const neededcolor =
          Math.floor(Math.random() * 2) == 1 ? `красный` : `чёрный`;

        const winother = new EmbedBuilder()
          .setTitle(`Вы выйграли!`)
          .setDescription(
            `**Вам выпал ${neededcolor} цвет. Ваша ставка умножается в полтора раза. Вы выйграли** \`${winmoney}\` **<:solana:1183097799756238858> у диллера. Деньги автоматически поступят вам на счёт.**`
          )
          .setColor(`#3ab03c`)
          .setThumbnail(`${neededcolor == `красный` ? `https://pngfre.com/wp-content/uploads/Rad-Circle-3.png` : `https://png.pngtree.com/png-clipart/20201029/ourmid/pngtree-circle-clipart-black-circle-png-image_2381996.jpg`}`)
          .setFooter({
            iconURL: interaction.user.avatarURL(),
            text: interaction.user.username,
          })
          .setTimestamp(new Date());

        await interaction.reply({ embeds: [winother] });

        await userModel.updateOne(
          {
            guild_id: interaction.guild.id,
            user_id: interaction.user.id,
          },
          {
            balance: intUser.balance + winmoney,
          }
        );
      }
    } else {
      const losemoney = intUser.balance - bid;
      const lose = new EmbedBuilder()
        .setTitle(`Вы проиграли!`)
        .setDescription(
          `**Вы проиграли** \`${bid}\` **<:solana:1183097799756238858> диллеру.**`
        )
        .setColor(`#a8342d`)
        .setFooter({
          iconURL: interaction.user.avatarURL(),
          text: interaction.user.username,
        })
        .setTimestamp(new Date());

      await interaction.reply({ embeds: [lose] });
    }
  },
};
