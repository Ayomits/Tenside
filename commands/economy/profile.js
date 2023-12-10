const { CommandInteraction, AttachmentBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { userModel, marryModel } = require("../../models/users");
const { registerFont, createCanvas, loadImage } = require("canvas");
const path = require("path");



module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("профиль пользователя")
    .addUserOption((option) =>
      option.setName("target").setDescription("target user").setRequired(false)
    ),

  /**
   * @param {CommandInteraction} interaction
   */

  async execute(interaction) {
    let start = new Date().getTime();
    await interaction.deferReply();
    try {
      const targetUser = interaction.options.get("target");

      const user = targetUser ? targetUser.user : interaction.user;

      const userDataQuery = await userModel.aggregate([
        {
          $match: {
            guild_id: interaction.guildId,
            user_id: user.id,
          },
        },
        {
          $lookup: {
            from: "marrypoints",
            let: { userId: "$user_id" },
            pipeline: [
              {
                $match: {
                  guild_id: interaction.guildId,
                  $expr: {
                    $or: [
                      { $eq: ["$partner1_id", "$$userId"] },
                      { $eq: ["$partner2_id", "$$userId"] },
                    ],
                  },
                },
              },
            ],
            as: "marrypoints",
          },
        },
      ]);

      let userData = userDataQuery[0];

      if (!userData)
        return await interaction.channel.send({
          content: "Такой пользователь не найден",
        });
      
      const canvas = createCanvas(1920, 1080);
      const ctx = canvas.getContext("2d");
      
      ctx.font = `35px Impact`; 
      ctx.fillStyle = "#5b647f"; // #5b647f

      const avatarURL = user.displayAvatarURL({ extension: "png", size: 128 });
      const marriedUser = userDataQuery[0].marrypoints[0];

      let member = await this.getMember(marriedUser, interaction, user);

      const background = await loadImage(path.resolve("profile.png"));
      const avatar = await loadImage(avatarURL);

      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      await this.roundImage(838, 228, 238, ctx, avatar); // аватарка юзера
      await this.roundImage(
        1445,
        540,
        218,
        ctx,
        await this.avatarMember(member)
      ); // аватарка брака
      await this.drawText(userData, marriedUser, ctx);

      await interaction.editReply({
        files: [
          new AttachmentBuilder()
            .setFile(canvas.toBuffer())
            .setName("profile.png"),
        ],
      });

      let end = new Date().getTime();
      console.log((end - start) / 1000);
    } catch (err) {
      console.log(err);
    }
  },

  /**
   *
   * @param {Number} x
   * @param {Number} y
   * @param {Number} size
   * @param {*} ctx
   * @param {*} avatar
   */
  async roundImage(x, y, size, ctx, avatar) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, x, y, size, size);
    ctx.restore();
  },

  /**
   *
   * @param {String} timestamp
   * @returns
   */

  async getDate(timestamp) {
    const date = new Date(Number(timestamp));

    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  },

  async drawText(userData, marriedUser, ctx) {
    ctx.fillText(Math.floor(userData.balance), 300, 510); // баланс
    ctx.fillText(userData.voiceActive, 380, 704); // активность в войсе
    ctx.fillText(userData.reputation, 450, 898); // репутация
    ctx.fillText(userData.messageCount, 450, 799); // количество сообщений
    ctx.fillText(
      !marriedUser
        ? "У пользователя нет брака"
        : await this.getDate(marriedUser.created_at),
      1450,
      345
    ); // просто таймстемп для приличия
    ctx.fillText("Система браков", 1450, 500);
  },

  async avatarMember(member) {
    let memberAvatar = member
      ? await loadImage(
          member.displayAvatarURL({ extension: "png", size: 128 })
        )
      : await loadImage("https://cdn-icons-png.flaticon.com/512/25/25333.png");
    return memberAvatar;
  },

  /**
   *
   * @param {marryModel} marriedUser
   * @param {CommandInteraction} interaction
   * @returns
   */

  async getMember(marriedUser, interaction, user) {
    let partner_id = marriedUser
      ? marriedUser.partner1_id === user.id
        ? marriedUser.partner2_id
        : marriedUser.partner1_id
      : "123";
    let member = interaction.client.guilds.cache
      .get(interaction.guildId)
      .members.cache.get(partner_id);

    return member;
  },

};
