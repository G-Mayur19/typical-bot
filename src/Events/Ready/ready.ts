import { Event } from "../../Interfaces/Event";
import { ActivityType, PresenceUpdateStatus } from "discord.js";
import mongoose from "mongoose";

const event: Event = {
    event: 'ready',
    async run(client) {
        if(!client.user) return;
        client.user.setPresence({
            activities: [
                {
                    name: "you",
                    type: ActivityType.Watching
                }
            ],
            status: "dnd"
        });
        console.log(`${client.user?.tag} is ready!`);
        const slashCmds = await client.loadSlash();
        const guild = client.guilds.cache.get(client.config.GuildID);
        if(guild) {
           await guild.commands.set(slashCmds);
           console.log(`Registered ${slashCmds.length} slash commands.`)
        } else {
            console.warn("Guild not found!")
        }
    },
}

export default event