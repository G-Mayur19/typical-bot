import { Command } from "../../Interfaces/Command";
import { EmbedBuilder } from "discord.js";
import { LevelDB } from "../../Models/level";
import { CalcRequiredXP } from "../../Functions/requiredXp";

const command: Command = {
    name: "leaderboard",
    description: "Leaderboard for level!",
    usage: "leaderboard",
    aliases: ["lb"],
    async run(client, message, args) {
        const msg = await message.channel.send(`Fetching leaderboard...`);
        const datas = await LevelDB.find();
        const LBData = datas.sort((a, b) => {
            if(a.Level === b.Level) {
                return b.XP - a.XP
            } else {
                return b.Level - a.Level
            }
        });
        const userRank = LBData.findIndex((v) => v.userId === message.author.id) + 1;
        let lbString = ``;
        for (let i = 0; i < LBData.length; i++) {
            if(i === 10) return;
            const data = LBData[i];
            let math = ((data.XP/CalcRequiredXP(data.Level))*100).toString();
            lbString += `**${i + 1}.** <@!${data.userId}> \`Level: ${data.Level}(${math}%)\`\n`
        }
        let footerText = ``;
        userRank ? footerText += `You are currently ranked #${userRank} in the server` : "Not yet ranked!"
        const lbEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Leaderboard")
        .setDescription(lbString || "No one in lb yet")
        .setFooter({
            text: footerText,
            iconURL: message.author.displayAvatarURL()
        })
        .setTimestamp();
        msg.delete().then(() => {
            setTimeout(() => {
                message.channel.send({
                    embeds: [lbEmbed]
                })
            }, 2000);
        })
    }
}

export default command