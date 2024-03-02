import { Slash } from "../../Interfaces/Slash";
import { ApplicationCommandType, EmbedBuilder } from "discord.js";

const slash: Slash = {
    data: {
        name: "ping",
        description: "Stats of the bot.",
        type: ApplicationCommandType.ChatInput
    },
    usage: "ping",
    run: async(client, interaction) => {
        interaction.deferReply();
        let str = ``;
        const uptime = client.uptime;
        if(!uptime) return;
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
            text: `Requested by ${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL() || undefined
        })
        .setTimestamp()
        .setTitle("My stats:")
        .setDescription(`**Ping: ** \`${client.ws.ping}ms\`\n**Uptime: ** \`${str}\`\n**Commands: ** \`${client.commands.size}\``)
        .setThumbnail(client.user?.displayAvatarURL() || null)
        interaction.editReply({ embeds: [replyEmbed]})
    }
}

export default slash