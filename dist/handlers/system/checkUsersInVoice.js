"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUsersInVoice = void 0;
const users_1 = require("../../models/users");
/**
 *
 * @param {Client} client
 */
const checkUsersInVoice = async (client) => {
    console.log("Занесение пользователей в войсах начато....");
    let start = Date.now();
    const guilds = client.guilds.cache;
    guilds.forEach((guild) => {
        guild.channels.cache.forEach((channel) => {
            if (channel.isVoiceBased()) {
                const members = channel.members.forEach(async (member) => {
                    client.voiceUsers.set(member.user?.id, setInterval(async () => {
                        await users_1.userModel.updateOne({ guild_id: channel.guildId, user_id: member.user?.id }, { $inc: { balance: 5, voiceActive: 60 } });
                    }, 60000));
                });
            }
        });
    });
    let end = (Date.now() - start) / 1000;
    console.log('[CheckUsersInVoice.js] занесение в коллекцию завершено. Время выполнения: ' + end + 'с');
};
exports.checkUsersInVoice = checkUsersInVoice;
