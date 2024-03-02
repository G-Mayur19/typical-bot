import { Command } from "../../Interfaces/Command";
import { EmbedBuilder } from "discord.js";
import { statusJava } from "node-mcstatus";

const command: Command = {
    name: 'server-stats',
    description: "Shows the status of a server!",
    usage: "server-stats [serverIP]",
    aliases: ["server-info", "server"],
    async run(client, msg, args) {
        if(!args[0]) return msg.reply("Enter a server address!");
        const res = await statusJava(args[0]);
        if(!res) return msg.reply("Server not found!");
        let online = ``;
        if(res.online) {
            online = `Online`
        } else {
            online = "Offline"
        }
        const resEmbed = new EmbedBuilder()
        .setColor("Random")
        .setFooter({
            text: `Requested by ${msg.author.tag}`,
            iconURL: msg.author.displayAvatarURL()
        })
        .setTimestamp()
        .setTitle("Server Stats: ")
        .setThumbnail(null)
        if(res.online) {
            resEmbed.setDescription(`IP: ${args[0]}\nStatus: Online\nPlayers: \`${res.players?.online}/${res.players?.max}\``)
        } else {
            resEmbed.setDescription(`Server is currently offline!`)
        }

        msg.channel.send({
            embeds: [resEmbed]
        });
    }
}

export default command