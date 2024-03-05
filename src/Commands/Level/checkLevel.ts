import { Command } from "../../Interfaces/Command";
import { EmbedBuilder } from "discord.js";
import { LevelDB } from "../../Models/level";
import { CalcRequiredXP } from "../../Functions/requiredXp";

const command: Command = {
    name: 'level',
    description: "Check your/others level!",
    usage: "level [member(optional)]",
    async run(client, message, args) {
        const user = message.mentions.users.first()|| message.author;
        const data = await LevelDB.findOne({
            userId: user.id
        });
        const lb = await LevelDB.find();
        lb.sort((a, b) => {
            if(a.Level === b.Level) {
                return b.XP - a.XP
            } else {
                return b.Level - a.Level
            }
        });
        const userRank = lb.findIndex((v) => v.userId === user.id) + 1;
        if(!data) return message.reply(`${user.username} hasn't started earning XP yet. Try chatting with users.`);
        const msg = await message.channel.send(`Fetching ${user.username} info...`);

        const RankEmbed = new EmbedBuilder()
        .setTitle(`${user.username}'s Progress`)
        .setThumbnail(user.displayAvatarURL() || null)
        .setFooter({
            text: `Requested by ${message.author.username}`,
            iconURL: message.author.displayAvatarURL()
        })
        .setColor("Random")
        .addFields(
            {
                name: `Level: ${data.Level}`,
                value: `XP: \`${data.XP}/${CalcRequiredXP(data.Level)}\`\nRank: \`${userRank}\``
            },
        )
        // Trying to create a attachment (soon)
        await msg.delete()
        await msg.channel.send({
            embeds: [RankEmbed]
        });
    },
    aliases: ['rank', "lvl"]
}

export default command