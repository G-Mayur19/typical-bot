import { Slash } from "../../Interfaces/Slash";
import { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import { LevelDB } from "../../Models/level";
import { CalcRequiredXP } from "../../Functions/requiredXp";
const slash: Slash = {
    data: {
        name: "level",
        description: "Check a user's/your level.",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: "user",
                description: "The user, to check their level!",
                type: ApplicationCommandOptionType.User,
                required: false
            }
        ],
    },
    usage: "level <user>",
    async run(client, interaction) {
        const user = interaction.options.getUser("user") || interaction.user;
        if(user.bot) return interaction.reply({
            content: "Bot's don't earn XP.",
            ephemeral: true
        });
        const data = await LevelDB.findOne({ userId: user.id});
        if(!data) return interaction.reply({
            content: `${user} hasn't earned any XP yet`,
            ephemeral: true
        });
        let datas = await LevelDB.find();
        datas = datas.sort((a, b) => {
            if(a.Level === b.Level) {
                return b.XP - a.XP
            } else {
                return b.Level - a.Level
            }
        });

        const userRank = datas.findIndex((v) => v.userId === user.id);
        const embed = new EmbedBuilder()
        .setTitle(`${user.username}'s Progress`)
        .setThumbnail(user.displayAvatarURL() || null)
        .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL()
        })
        .setColor("Random")
        .addFields(
            {
                name: `Level: ${data.Level}`,
                value: `XP: \`${data.XP}/${CalcRequiredXP(data.Level)}\`\nRank: \`${userRank}\``
            },
        );
        await interaction.reply({
            embeds: [embed]
        });
    },
}

export default slash