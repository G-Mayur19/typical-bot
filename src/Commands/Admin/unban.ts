import { Command } from "../../Interfaces/Command";
import { EmbedBuilder } from "discord.js";

const command: Command = {
    name: "unban",
    description: "Unban a member!",
    async run(client, message, args) {
        if(!message.mentions.members?.first()) return message.reply("Who do I unban?");
        const members = message.mentions.members.values();
        let count = 0;
        for (const member of members) {
            if(member.roles.cache.has("1202684963846094888")) return message.reply(`Cannot unban ${member.user.tag}`);
            message.guild?.members.unban(member.id);
            count++
        }
        message.channel.send(`Unbanned ${count} members`);
    },
    usage: `unban [members(max10)]`
}

export default command