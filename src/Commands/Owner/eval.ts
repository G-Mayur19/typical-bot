import { Command } from "../../Interfaces/Command";
import { EmbedBuilder } from "discord.js";

const command: Command = {
    name: "eval",
    description:"...",
    usage: "No.",
    async run(client, message, args) {
        const eva = args.join(" ");
        try {
            const res = eval(eva);
            message.channel.send(`\`${res}\``)
        } catch (error) {
            message.channel.send(`Code resulted in an error`)
        }
    },
}

export default command