import { Event } from "../../Interfaces/Event";
import { ActivityType, GuildMember } from "discord.js";
import { LevelDB } from "../../Models/level";

const event: Event = {
    event: 'guildMemberAdd',
    async run(client, member: GuildMember) {
        if(member.user.bot) return;
        await LevelDB.create({
            userId: member.id,
            Level: 1,
            XP: 0
        });
    }
}

export default event