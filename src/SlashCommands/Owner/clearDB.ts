import { Slash } from "../../Interfaces/Slash";
import { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { LevelDB } from "../../Models/level";
import { suggestionDB } from "../../Models/suggestion";

const slash: Slash = {
    data: {
        name: "clear-db",
        description: "Clear a database",
        options: [
            {
                name: "database",
                description: "Choose the database",
                type: ApplicationCommandOptionType.String,
                choices: [
                    {
                        name: "level",
                        value: "level"
                    },
                    {
                        name: "suggestion",
                        value: "suggestion"
                    }
                ],
                required: true
            }
        ]
    },
    ownerOnly: true,
    usage: "clear-db <DB>",
    async run(client, interaction) {
        const choice = interaction.options.getString("database", true);
        if(choice === "level") {
            await LevelDB.deleteMany();
            interaction.reply({
                content: `LevelDB has been deleted!`,
                ephemeral: true
            });
        } else if(choice === "suggestion") {
            await suggestionDB.deleteMany();
            interaction.reply({
                content: `Suggestions have been cleared!`,
                ephemeral: true
            });
        }
        
    },
}

export default slash