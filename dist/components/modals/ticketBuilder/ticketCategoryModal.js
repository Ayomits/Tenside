"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tickets_1 = require("../../../models/tickets");
const button = {
    customId: "ticketCategoryModal",
    /**
     *@param {ModalSubmitInteraction} interaction
     */
    async execute(interaction) {
        const categoryId = interaction.fields.getField("categoryId").value;
        await tickets_1.TicketCategory.findOne({ guild_id: interaction.guildId }).then(async (result) => {
            if (result === null) {
                await tickets_1.TicketCategory.create({ guild_id: interaction.guildId, category_id: categoryId });
                await interaction.reply({ content: "Успешно создана категория для тикетов", ephemeral: true });
            }
            else {
                await tickets_1.TicketCategory.updateOne({ guild_id: interaction.guildId, category_id: categoryId });
                await interaction.reply({ content: "Успешно обновлена категория для тикетов", ephemeral: true });
            }
        });
    }
};
exports.default = button;
