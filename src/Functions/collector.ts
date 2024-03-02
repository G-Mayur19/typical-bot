import { Bot } from "../Client";
import { Command } from "../Interfaces/Command";
import { ComponentType, EmbedBuilder, Message, Interaction, ActionRowBuilder, StringSelectMenuBuilder  } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";

async function collector(client: Bot, message: Message, row: ActionRowBuilder<StringSelectMenuBuilder>, userId: string) {
    const filter = (m: Interaction) => m.user.id === userId
    const collector = message.channel.createMessageComponentCollector({
        time: 60000,
        componentType: ComponentType.StringSelect,
        filter: filter
    });
    const owner = await message.guild?.members.fetch(userId)
    collector.on("collect", async(i) => {
        const embed = new EmbedBuilder()
        .setTitle("Commands of " + i.values[0])
        .setColor("Random")
        .setFooter({
            text: `Requested by ${owner?.user.tag}`,
            iconURL: owner?.displayAvatarURL() || undefined
        })
        .setThumbnail(client.user?.avatarURL() || null)
        .setTimestamp()
        const path = join(__dirname, "..", "Commands", i.values[0]);
        readdirSync(path).forEach(file => {
            const pull: Command = require(`../Commands/${i.values[0]}/${file}`).default;
            embed.addFields(
                {
                    name: `**Name: ** \`${client.prefix}${pull.name}\``,
                    value: `**Description: ** \`${pull.description}\`\n**Usage: ** \`${client.prefix}${pull.usage}\``
                }
            )
        });
        i.message.edit({ embeds: [embed], content: `**${i.values[0]}**`});
        i.reply({
            content: `Set category to ${i.values[0]}`,
            ephemeral: true
        })
    });

    collector.on('end', () => {
        row.components.forEach((d) => d.setDisabled(true));
        message.edit({ 
            components: [row],
            content: `Time's up`,
            embeds: []
        })
    })
}

export default collector
