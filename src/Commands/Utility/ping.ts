import { Command } from "../../Interfaces/Command";
import { Embed, EmbedBuilder } from "discord.js";

const command: Command = {
    name: "ping",
    description: "Stats of the bot!",
    usage: "ping",
    aliases: ['stats', 'info'],
    async run(client, msg, args) {
        let str = ``;
        const uptime = msg.client.uptime;
        if(uptime < 60000) {
            str = `Less than a minute`
        } else if(uptime > 60000 && uptime < 3600000) {
            str = `${Math.round(uptime / 60000)} minutes`
        } else {
            str = `${Math.round(uptime / 3600000)} hours`
        }

        const replyEmbed = new EmbedBuilder()
        .setColor("Random")
        .setFooter({
            text: `Requested by ${msg.author.tag}`,
            iconURL: msg.member?.displayAvatarURL() || undefined
        })
        .setTimestamp()
        .setTitle("My stats:")
        .setDescription(`**Ping: ** \`${client.ws.ping}ms\`\n**Uptime: ** \`${str}\`\n**Commands: ** \`${client.commands.size}\`\n**Slash Commands: ** \`${client.slash.size}\``)
        .setThumbnail(client.user?.displayAvatarURL() || null)
        msg.channel.send({
            embeds: [replyEmbed]
        });
    }
}

export default command