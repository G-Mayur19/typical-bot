import { readdirSync } from "fs";
import { Slash } from "../../Interfaces/Slash";
import { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder, StringSelectMenuBuilder, SelectMenuComponentOptionData } from "discord.js";
import { OwnerDB } from "../../Models/owner";
import { join } from "path";
import collector from "../../Functions/collector";

const emojis = [
    {
        name: "Admin",
        emoji: "🔒"
    },
    {
        name: "Fun",
        emoji: "🎮"
    },
    {
        name: "Minecraft",
        emoji: "<:minecraft:1212463173895200798>"
    },
    {
        name: "Owner",
        emoji: "🚫"
    },
    {
        name: "Utility",
        emoji: "🛠️"
    },
    {
        name: "Level",
        emoji: "⬆️"
    },
    {
        name: "Vote",
        emoji: "❓"
    },
]


const slash: Slash = {
    usage: "help <command>",
    data: {
        name: "help",
        description: "Help command.",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: "command",
                description: "Command name (optional)",
                type: ApplicationCommandOptionType.String,
                required: false
            }
        ]
    },
    async run(client, interaction) {
        const option = interaction.options.getString("command");
        if(!option) {
            await interaction.deferReply()
            const row = new ActionRowBuilder<StringSelectMenuBuilder>();
            const menu = new StringSelectMenuBuilder()
            .setPlaceholder("Select a category to view: ")
            .setCustomId("help-slash-cmd")
            .setMinValues(1)
            .setMaxValues(1);
            const options: SelectMenuComponentOptionData[] = [];
            const data = await OwnerDB.findOne({ userId: client.config.Owner });
            if(data) {
                readdirSync(join(__dirname, "..", "..", "SlashCommands")).forEach((dir) => {
                    if(dir === "Owner" || data.Category.includes(dir)) {
                        return
                    } else {
                        const emoji = emojis.find((v) => v.name === dir)?.emoji
                        const option: SelectMenuComponentOptionData = {
                            label: dir,
                            value: dir,
                            emoji: emoji,
                        }
                        options.push(option)
                    }
                });
                menu.addOptions(options);
                row.addComponents(menu)
                const msg = await interaction.followUp({
                    content: `Select one of the categories below!`,
                    fetchReply: true,
                    components: [row]
                });
                await collector(client, msg, row, interaction.user.id , true);
            }
        } else {
            const embed = new EmbedBuilder();
            const cmd = client.getCmd(client, option, true);
            if(!cmd) {
                embed.setColor("Red")
                .setDescription(`Command not found!\nIf command is a message type command use \`${client.prefix}help\``);
                return interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                });
            }
            if(client.checkSlash(cmd)) {
                embed.setColor("Green")
                .setFooter({
                    text: `Requested by ${interaction.user.tag}.`,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setTimestamp()
                .setTitle("Command details: ")
                .setDescription(`Name: \`${cmd.data.name}\`\nDescription: \`${cmd.data.description}\`\nUsage: \`${cmd.usage}\``)
                .setThumbnail(client.user?.displayAvatarURL() || null);
                await interaction.reply({
                    embeds :[embed]
                })
            }
        }
    },
}

export default slash