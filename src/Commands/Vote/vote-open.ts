import { Command } from "../../Interfaces/Command";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder } from "discord.js";
import { OwnerDB } from "../../Models/owner";

const command: Command = {
    name: "vote-open",
    description: "Open voting!",
    usage: "vote-open",
    ownerOnly: true, // REQUIRED
    async run(client, message, args) {
        let data = await OwnerDB.findOne({
            userId: client.config.Owner
        });
        if(!data) {
            data = await OwnerDB.create({
                userId: client.config.Owner
            });
        }

        data.Voting = true
        await data.save();
        const button = new ButtonBuilder()
        .setCustomId("yes")
        .setLabel("Yes")
        .setStyle(ButtonStyle.Success);
        const button2 = new ButtonBuilder()
        .setCustomId("no")
        .setLabel("No")
        .setStyle(ButtonStyle.Danger)
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button, button2)
        const msg = await message.channel.send({
            content: `Voting has been opened.\nDo you want to announce it?`,
            components: [row]
        });
        const collector = await msg.createMessageComponentCollector({
            time: 10000,
            filter: (i) => i.user.id === client.config.Owner,
            max: 1
        });
        collector.on("collect", async(i) => {
            if(i.customId === "yes") {
                const channel = client.channels.cache.get("1202684344406249614") // your announcement channel id
                if(!channel || channel.type !== ChannelType.GuildText) return;
                await channel.send(`<@&1214119343718400000> voting has been opened!\nUse \`${client.prefix}vote\` to vote!`);
                i.reply({
                    content: `Sent announcement`,
                    ephemeral: true
                });
            } else {
                i.reply({
                    content: `Cancelled announcement.`,
                    ephemeral: true
                })
            }
        });
        collector.on("end", async(c) => {
            await msg.edit({
                components: []
            });
        });
    },
}

export default command