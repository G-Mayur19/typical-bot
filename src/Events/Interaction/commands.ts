import { Event } from "../../Interfaces/Event";
import { ActivityType, CommandInteraction } from "discord.js";

const event: Event = {
    event: "interactionCreate",
    run: async(client, interaction: CommandInteraction) => {
        if(!interaction.isChatInputCommand() || !interaction.inGuild()) return;
        const cmd = client.slash.get(interaction.commandName);
        if(!cmd) return interaction.reply({
            content: `Couldn't execute command!`,
            ephemeral: true
        });

        try {
            await cmd.run(client, interaction)
        } catch (error) {
            console.error(error)
        }
    }
}

export default event