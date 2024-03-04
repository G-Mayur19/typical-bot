import { Slash } from "../../Interfaces/Slash";
import { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, AttachmentBuilder } from "discord.js";
import Discord from "discord.js";
import { OwnerDB } from "../../Models/owner";
import { VoteDB } from "../../Models/vote";
import { LevelDB } from "../../Models/level";

const slash: Slash = {
    data: {
        name: "eval",
        description: "Evaluate a code!",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: "code",
                description: "Enter code to evaluate!",
                required: true,
                type: ApplicationCommandOptionType.String,

            }
        ]
    },
    usage: "eval <code>",
    ownerOnly: true,
    async run(client, interaction) {
        const code = interaction.options.getString("code", true);
        try {
            if(code.includes("client.token") || code.includes("client.config.token") || code.includes("interaction.client.token") || code.includes("interaction.client.config.token")) return interaction.reply(`NO.`)
            const res = eval(code);
            await interaction.reply(`\`\`\`\n${res}\n\`\`\``);
        } catch (error) {
            interaction.reply({
                content: `Error: Content is too large to display!`
            })
        }
    },
}

export default slash