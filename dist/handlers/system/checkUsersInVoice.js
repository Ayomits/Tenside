"use strict";
const { Client, ChannelType } = require("discord.js");
const { userModel } = require("../../models/users");
/**
 *
 * @param {Client} client
 */
module.exports.checkUsersInVoice = async (client) => {
    console.log("Занесение пользователей в войсах начато....");
    let start = Date.now();
    const guilds = client.guilds.cache;
    guilds.forEach((guild) => {
        guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).forEach(channel => {
            channel.members.forEach(member => {
                client.voiceUsers.set(member.user.id, setInterval(async () => {
                    await userModel.updateOne({ guild_id: channel.guildId, user_id: member.user.id }, { $inc: { balance: 5, voiceActive: 60 } });
                }, 60000));
            });
        });
    });
    let end = (Date.now() - start) / 1000;
    console.log('[CheckUsersInVoice.js] занесение в коллекцию завершено. Время выполнения: ' + end + 'с');
};
