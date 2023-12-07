const { Events,EmbedBuilder, GuildMember } = require("discord.js");
const channelModel = require(`../../models/channel`);
const userModel = require(`../../models/users`);
module.exports = {
  name: Events.GuildMemberAdd,
  once: false,
  /**
   *
   * @param {GuildMember} member
   */
  async execute(member) {
    if (member.user.bot) {
      return;
    }
    try {


      const checkGuild = await channelModel.channelModel.findOne({
        guild_id: member.guild.id,
      });
      if (!checkGuild) return;

      const guild = member.client.guilds.cache.get(checkGuild.guild_id);
      const channel = guild.channels.cache.get(checkGuild.channel_id);

      const welcomeMessages = [
        `<@${member.user.id}> Добро пожаловать на наш сервер! Рады видеть тебя на ${guild.name}! 🌟`,
        `<@${member.user.id}> Приветствуем нового участника! Надеемся, тебе у нас понравится! `,
        `<@${member.user.id}> Приветствуем вас на ${guild.name}! Если у вас есть вопросы, не стесняйтесь спрашивать. 👋`,
        `<@${member.user.id}> Здравствуй! Новые лица всегда вдохновляют нас. Добро пожаловать на ${guild.name}! `,
      ];

      const randomIndex = Math.floor(Math.random() * welcomeMessages.length);
      const selectedMessage = welcomeMessages[randomIndex];
      const embed = new EmbedBuilder().setDescription(selectedMessage).setTitle(`Добро пожаловать!`).setImage(`https://i.gifer.com/9uiZ.gif`).setColor(`#36393e`) .setFooter({ text: member.guild.name, iconURL: member.guild.icon.url });

      const checkuser = await userModel.userModel.findOne({
        guild_id: member.guild.id,
        user_id: member.user.id,
      });
      if (!checkuser) {
        {
          try {
            await userModel.create({
              guild_id: member.guild.id,
              user_id: member.user.id,
            });
            await channel.send({embeds:[embed]});
          } catch (err) {}
        }
      } else {
        await channel.send({embeds:[embed]});
      }
    } catch (error) {
      console.error(error);
    }
  },
};
