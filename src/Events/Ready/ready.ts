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
        await console.log(`${client.user?.tag} is ready!`)
    },
}

export default event