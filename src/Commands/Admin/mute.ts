import { Command } from "../../Interfaces/Command";
import { EmbedBuilder } from "discord.js";
import ms from "ms";

const command: Command = {
    name: 'mute',
    description: 'Timeout a user!',
    aliases: ["timeout"],
    async run(client, message, args) {
        if(!message.member?.permissions.has("Administrator")) return message.reply("Nah you ain't got the permissions.");
        const member = message.mentions.members?.first();
        if(!member) return message.reply("Who do I mute huh?");
        const time = args[1];
        if(!time) return message.reply("How many hours do I mute the user?");
        const t = ms(time);
        if(!t) return message.reply("Couldn't eval time!");
        const reason = args.slice(2).join(" ") || undefined;
        if(!member.manageable) return message.reply("Couldn't timeout this user!");
        await member.timeout(t, reason);
        let str = ``;
        if(t < 60000) {
            str = `Less than a minute`
        } else if(t > 60000 && t < 3600000) {
            str = `${Math.round(t / 6000)} minutes`
        } else {
            str = `${Math.round(t / 3600000)} hours`
        }
        message.channel.send({
            content: `${member.user.tag} has been muted for ${str}`
        });
    },
    usage: `mute [@member] [time] [reason(optional)]`
}

export default command