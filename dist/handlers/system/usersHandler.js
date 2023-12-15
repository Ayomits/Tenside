"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersHandler = exports.createUser = exports.isUserCreated = void 0;
const users_1 = require("../../models/users");
/**
 *
 * @param {String} userId
 * @param {String} guildId
 */
async function isUserCreated(guildId, userId) {
    const user = await users_1.userModel.findOne({ guild_id: guildId, user_id: userId });
    return !!user;
}
exports.isUserCreated = isUserCreated;
/**
 *
 * @param {String} userId
 * @param {String} guildId
 */
async function createUser(userId, guildId) {
    await users_1.userModel.create({ user_id: userId, guild_id: guildId });
}
exports.createUser = createUser;
/**
 *
 * @param {Client} client
 */
async function usersHandler(client) {
    let start = Date.now();
    const guilds = client.guilds.cache.map((guild) => guild);
    let count = 0;
    for (let guild of guilds) {
        const members = await guild.members.fetch();
        members.forEach(async (member) => {
            const userExists = await isUserCreated(member.guild.id, member.user.id);
            if (!userExists && !member.user.bot) {
                count += 1;
                await createUser(member.user.id, member.guild.id);
            }
        });
        let end = (Date.now() - start) / 1000;
        console.log("[USERSHANDLER.JS] время выполнения " + end);
    }
}
exports.usersHandler = usersHandler;
