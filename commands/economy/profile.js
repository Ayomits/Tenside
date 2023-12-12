const { CommandInteraction, AttachmentBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { userModel, marryModel } = require("../../models/users");
const { createCanvas, loadImage, GlobalFonts } = require("@napi-rs/canvas");
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
      let pathToFont = path.resolve("fonts", "montserat.ttf")

      GlobalFonts.registerFromPath(pathToFont, "montserat")

      const canvas = createCanvas(1920, 1080);
      const ctx = canvas.getContext("2d");
    
      ctx.textAlign = 'center'

      const avatarURL = user.displayAvatarURL({ extension: "png", size: 256 });
      const marriedUser = userDataQuery[0].marrypoints[0];

      const background = await loadImage(path.resolve("imgs", "newprofile.png"));
      const avatar = await loadImage(avatarURL);

      await Promise.all([
        await this.drawBackground(background, ctx, canvas),
        await this.roundImage(820, 173.8, 290, ctx, avatar),
        await this.userStats(ctx, userData),
        await this.userAbout(ctx, userData, user),
        await this.marryLogic(ctx, marriedUser, interaction, user)
      ])

      await Promise.all([
        await interaction.editReply({
          files: [
            new AttachmentBuilder(canvas.toBuffer("image/png"), {name: "profile.png"})
          ],
        }),
  
        await this.optimize(ctx, canvas)
      ])

      let end = new Date().getTime();
      console.log((end - start) / 1000);
      
    } catch (err) {
      console.log(err);
    }
  },

  async userStats (ctx, userData) {
    await Promise.all([
      await this.drawText(ctx, String((userData.voiceActive / 3600).toFixed(2)) + "ч", "48px montserat", "#FFFFFF", 480, 250),
      await this.drawText(ctx, String(userData.messageCount), "48px montserat", "#FFFFFF", 480, 475),
      await this.drawText(ctx, String(userData.reputation), "48px montserat", "#FFFFFF", 480, 700)
    ])
  },

  async userAbout (ctx, userData, user) {
    await Promise.all([
      await this.drawText(ctx, user.username, '58px montserat', '#FFFFFF', 965, 590),
      await this.drawText(ctx, String(userData.status), '28px montserat', '#949598', 965, 650),
      await this.drawText(ctx, String(userData.balance), '48px montserat', "#FFFFFF", 915, 830)
    ])
  },

  async marryLogic (ctx, marriedUser, interaction, user) {
    const marriedMember = await this.getMember(marriedUser, interaction, user);
    let avatarUrl = !marriedMember ? path.resolve("imgs", "question.png") : marriedMember.user.displayAvatarURL({ extension: "png", size: 256 })
    const avatar = await loadImage(avatarUrl)
    if (marriedMember) {
      const marryDate = await this.getDate(marriedUser.created_at)
      const partner = await userModel.findOne({user_id: marriedMember.user.id, guild_id: interaction.guildId})
      await this.drawText(ctx, String(partner.status), '28px montserat', '#949598', 1580, 690)
      await this.drawText(ctx, String(marryDate), '32px montserat', '#FFFFFF', 1580, 736)
      }
    await Promise.all([
      await this.roundImage(1440, 237.5, 291, ctx, avatar),
      await this.drawText(ctx, !marriedMember ? "Отсутствует" : marriedMember.user.username , "48px montserat", "#FFFFFF", 1580, 640),
    ])
  },

  async roundImage(x, y, size, ctx, avatar) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, x, y, size, size);
    ctx.restore();
  },

  async getDate(timestamp) {
    const date = new Date(Number(timestamp));

    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  },

  async drawText(ctx, text, font, color, x, y) {
    ctx.font = font
    ctx.fillStyle = color
    ctx.fillText(text, x, y) // статусы юзеров
    
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

  async optimize (ctx, canvas) {
    ctx.restore()
    ctx.resetTransform()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  },

  async drawBackground (background, ctx, canvas) {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  }

};
