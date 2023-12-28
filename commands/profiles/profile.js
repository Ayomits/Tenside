const { CommandInteraction, AttachmentBuilder, User, GuildMember } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { createCanvas, loadImage, GlobalFonts } = require("@napi-rs/canvas");
const path = require('path');
const { userModel } = require("../../models/users");


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
    let start = Date.now()
    const user = interaction.options.getUser('target') || interaction.user
    await interaction.deferReply()

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

    const userData = userDataQuery[0]
    
    if (!userData) {
      return await interaction.editReply({content: "Такой пользователь не найден", ephemeral: true})
    }

    const marryData = userDataQuery[0].marrypoints[0]
    const member = this.getMember(marryData, interaction, user)
    GlobalFonts.registerFromPath(path.resolve(__dirname, 'fonts', 'montserat.ttf'), "montserat")

    const canvas = createCanvas(629, 353)
    const ctx = canvas.getContext("2d")

    ctx.font = '20px montserat'
    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'center'
    
    ctx.drawImage(await loadImage(path.resolve(__dirname, 'assets', 'newprofile.png')), 0, 0, canvas.width, canvas.height),
    await this.roundImage(269, 56, 95, await loadImage(user.displayAvatarURL({size: 256})), ctx)
    this.userAbout(ctx, userData.status, user);
    this.userStats(ctx, userData)
    await this.marryStats(ctx, marryData, member)

    await interaction.followUp({files: [new AttachmentBuilder(canvas.toBuffer('image/png')).setName('profile.png')]})

    console.log((Date.now() - start) / 1000);
  },

  async roundImage(x, y, size, avatar, ctx) {
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
   * @param {CanvasRenderingContext2D} ctx 
   * @param {String} status 
   * @param {User} user 
   */

  userAbout (ctx, status, user) {
    ctx.save()
    ctx.fillText(user.username, 320, 190)
    ctx.font = '10px montserat'
    ctx.fillStyle = '#949598'
    ctx.fillText(status, 320, 210)
    ctx.restore()
  },

  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   * @param {*} userData 
   * @param {User} user 
   */

  userStats(ctx, userData) {
    ctx.save()
    ctx.font = '17px montserat'
    ctx.fillStyle = '#FFFFFF'

    ctx.fillText(String(Number(userData.voiceActive / 3600).toFixed(2)) + 'ч', 140 , 89)
    ctx.fillText(String(userData.messageCount), 140, 160)
    ctx.fillText(String(userData.reputation), 140, 230)
    ctx.fillText(String(userData.balance), 310, 270)

    ctx.restore()
  },

  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   * @param {any} marryData 
   * @param {GuildMember} member 
   */

  async marryStats(ctx, marryData, member) {
    const memberInDb =  member ? await userModel.findOne({user_id: member.user?.id, guild_id: member.guild?.id}) : ""
    await this.roundImage(470, 77, 97, await loadImage(!member ? path.resolve(__dirname, 'assets', 'question.png') : member.user.displayAvatarURL({size: 128})), ctx)
    ctx.font = '16px montserat'
    ctx.fillText(member ? member.user.username : "Отсутствует", 515, 200)
    ctx.fillText(marryData ? this.getDate(marryData.created_at) : "", 515, 235)
    ctx.font = '10px montserat'
    ctx.fillStyle = '#949598'
    ctx.fillText(memberInDb === "" ? "" : memberInDb.status, 515, 213)
    
  },

  getMember(marriedUser, interaction, user) {
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

  getDate(timestamp) {
    const date = new Date(Number(timestamp));

    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  },
};


// 596 500 - баланс
