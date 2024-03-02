import { Event } from "../../Interfaces/Event";
import { ActivityType, Message } from "discord.js";

const event: Event = {
    event: "messageCreate",
    run: async(client, msg: Message) => {
        if(msg.author.bot || !msg.inGuild) return;
        if(msg.mentions) {
            if(msg.mentions.users.has(client.config.Owner)) {
            await msg.react("<:annoyed:1212477890743246948>");
            } else {
                return;
            }
        } else {
            return;
        }
    }
}

export default event