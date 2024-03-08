import { Event } from "../../Interfaces/Event";
import { ActivityType, Message } from "discord.js";

interface obj {
    name: string,
    emoji: string
}


const event: Event = {
    event: "messageCreate",
    async run(client, message: Message) {
        if(!message.guild) return;
        if(message.author.bot) return;
        if(message.channel.id !== client.config.PollChannel) return;
        if(message.author.id === client.config.Owner) {
            if(!message.mentions.roles) return;
            if(!message.mentions.roles.has("1214119388395864104")) return;
            const args = message.content.toLowerCase().split("\n");
            args.shift();
            try {
                for (const arg of args) {
                    if(arg.includes("|")) {
                        const string = arg.split("|");
                        await message.react(string[0].trim());
                    }
                }
            } catch (error: any) {
                await client.sendError(error, client);
            }
        } else {
            await message.delete();
        }
    },
}

export default event