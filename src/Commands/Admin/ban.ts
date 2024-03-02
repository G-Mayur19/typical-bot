import { Command } from "../../Interfaces/Command";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } from "discord.js";

const command: Command = {
    name: "ban",
    description: "Ban a member!",
    async run(client, message, args) {
        if(!message.mentions.members?.first()) return message.reply("Who do I ban?");
        let success = 0;
        let failed = 0;
        const members = message.mentions.members.values();
        const actionRow = new ActionRowBuilder<ButtonBuilder>();
        const buttonConfirm = new ButtonBuilder()
        .setCustomId("ban")
        .setStyle(ButtonStyle.Danger)
        .setLabel("Confirm");
        const buttonDeny = new ButtonBuilder()
        .setCustomId("no")
        .setStyle(ButtonStyle.Success)
        .setLabel("Cancel");
        actionRow.addComponents(buttonConfirm, buttonDeny)
        message.channel.send({
            content: "Are you sure you want to ban these users?",
            components: [actionRow]
        });

        const collector = message.channel.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 10000,
            max: 1,
        });
        collector.on('collect', async(i) => {
            if(i.user.id !== message.author.id) return;
            if(i.customId === "ban") {
                for (const member of members) {
                    if(member.bannable) {
                        failed++
                    } else {
                        await member.ban()
                        success++
                    }
                }
                message.channel.send(`Banned ${success} users.\nFailed count: ${failed}`)
            } else if(i.customId === "no") {
                message.channel.send(`Cancelled!`)
            } else {
                return;
            }
        });

        collector.on("end", (i)=> { return });
    },
    usage: `ban [members(max10)]`
}

export default command