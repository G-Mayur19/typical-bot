import { Slash } from "../../Interfaces/Slash";
import { EmbedBuilder, ApplicationCommandType } from "discord.js";
import { LevelDB } from "../../Models/level";
import { CalcRequiredXP } from "../../Functions/requiredXp";
const slash: Slash = {
    usage: "leaderboard",
    data: {
        name: "leaderboard",
        description: "Leaderboard of top users with highest level",
        type: ApplicationCommandType.ChatInput,
    },
    async run(client, interaction) {
        await interaction.deferReply();
        const LBData = await LevelDB.find();
        LBData.sort((a, b) => {
            if(a.Level === b.Level) {
                return b.XP - a.XP
            } else {
                return b.Level - a.Level
            }
        });
        const userRank = LBData.findIndex((v) => v.userId === interaction.user.id) + 1;
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
            iconURL: interaction.user.displayAvatarURL()
        })
        .setTimestamp();
        await interaction.followUp({
            embeds: [lbEmbed]
        })
    },
}

export default slash