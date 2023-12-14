"use strict";
const { SlashCommandBuilder } = require("@discordjs/builders");
const { userModel } = require("../../models/users");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("givemoney")
        .setDescription("Выдать валюту пользователю")
        .addUserOption((option) => option.setName("target").setDescription("Пользователь, которому вы хотите выдать валюту").setRequired(true))
        .addIntegerOption((option) => option.setName("amount").setDescription("Количество валюты для выдачи").setRequired(true)),
    async execute(interaction) {
        // Check if the command user has the required permissions (e.g., admin)
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
            return await interaction.reply({
                content: "У вас нет прав на использование этой команды.",
                ephemeral: true,
            });
        }
        const target = interaction.options.get("target");
        const amount = interaction.options.getInteger("amount");
        if (amount <= 0) {
            return await interaction.reply({
                content: "Количество валюты должно быть положительным числом.",
                ephemeral: true,
            });
        }
        const targetUser = await userModel.findOne({
            guild_id: interaction.guild.id,
            user_id: target.user.id,
        });
        if (!targetUser) {
            return await interaction.reply({
                content: "Указанный пользователь не найден в базе данных.",
                ephemeral: true,
            });
        }
        // Update the target user's balance
        const updatedTargetBalance = targetUser.balance + amount;
        await userModel.updateOne({
            guild_id: interaction.guild.id,
            user_id: target.user.id,
        }, {
            balance: updatedTargetBalance,
        });
        return await interaction.reply({
            content: `Успешно выдано ${amount} валюты пользователю <@${target.user.id}>.`,
            ephemeral: true,
        });
    },
};
