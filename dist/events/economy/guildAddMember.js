"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const users_1 = require("../../models/users");
const guildAddMember = {
    name: discord_js_1.Events.GuildMemberAdd,
    once: false,
    /**
     * @param {GuildMember} member
     */
    async execute(member) {
        if (!member.user.bot) {
            const user = await users_1.userModel.findOne({ guild_id: member.guild?.id, user_id: member.user?.id });
            if (!user) {
                await users_1.userModel.create({ guild_id: member.guild?.id, user_id: member.user?.id });
            }
        }
    }
};
exports.default = guildAddMember;
