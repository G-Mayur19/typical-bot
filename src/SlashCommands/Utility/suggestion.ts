import { Slash } from "../../Interfaces/Slash";
import { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, TextInputBuilder, TextInputStyle, ApplicationCommandOptionType, ModalBuilder } from "discord.js";
import { suggestionDB } from "../../Models/suggestion";


const slash: Slash = {
    data: {
        name: "suggestion",
        description: "Give a suggestion you would like!",
        options: [
            {
                name: "type",
                description: "Type of suggestion: ",
                required: true,
                type: ApplicationCommandOptionType.String,
                choices: [
                    {
                        name: "New feature",
                        value: "New feature"
                    },
                    {
                        name: "Change in a feature",
                        value: "Change in a feature"
                    }
                ]
            }
        ]
    },
    async run(client, interaction) {
        const choice = interaction.options.getString("type", true);

        const modal = new ModalBuilder()
        .setCustomId("suggestionModal")
        .setTitle(`${choice}`);

        const input = new TextInputBuilder()
        .setCustomId("suggestionInput")
        .setLabel("Your suggestion: ")
        .setMaxLength(1000)
        .setStyle(TextInputStyle.Paragraph);

        const row = new ActionRowBuilder<TextInputBuilder>()
        .addComponents(input);
        modal.addComponents(row);
        
        await interaction.showModal(modal);
        await suggestionDB.create({
            userId: interaction.user.id,
            Votes: 0,
            Type: choice
        });
    },
    usage: "suggestion"
}

export default slash