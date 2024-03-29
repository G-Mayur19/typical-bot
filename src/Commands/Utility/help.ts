import { Command } from "../../Interfaces/Command";
import { EmbedBuilder, ActionRowBuilder, SelectMenuComponentOptionData, StringSelectMenuBuilder,  } from "discord.js";
import collector from "../../Functions/collector";
import { readdirSync } from "fs";
import { join } from "path";
import { OwnerDB } from "../../Models/owner";

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

const command: Command = {
    name: "help",
    aliases: ["madath", "sahaya"],
    description: "Help command.",
    async run(client, message, args) {
        if(!message.guild) return;
        const CMD = args[0];
        if(!CMD) {
            const row = new ActionRowBuilder<StringSelectMenuBuilder>();
            const menu = new StringSelectMenuBuilder()
            .setPlaceholder("Select a category to view: ")
            .setCustomId("help-cmd")
            .setMinValues(1)
            .setMaxValues(1);
            const options: SelectMenuComponentOptionData[] = [];
            const path = join(__dirname, "..", "..", "Commands");
            const data = await OwnerDB.findOne({ userId: client.config.Owner});
            if(data === null) return;
            readdirSync(path).forEach(dir => {
                if(dir == "Owner") return;
                if(data.Category.includes(dir)) {
                    return;
                } else {
                    const emoji = emojis.find((v) => v.name === dir);
                    const placeholder: SelectMenuComponentOptionData = {
                        label: dir,
                        value: dir,
                        description: `${dir} commands`,
                        emoji: emoji?.emoji
                    }
                    options.push(placeholder)
                }
            });  
            menu.setOptions(options);
            row.addComponents(menu);
            const msg = await message.channel.send({ 
                components: [row],
                content: "Choose a category below!"
            });
            await collector(client, msg, row, message.author.id, false);
        } else {
            const cmd = client.getCmd(client, CMD.toLowerCase(), false);
            if(!cmd) return message.reply("Command not found lmao!");
            if(!client.checkCommand(cmd)) return message.reply("Only message commands can be used in this command!");
            const embed = new EmbedBuilder()
            .setColor("Random")
            .setFooter({
                text: `Requested by ${message.author.tag}.`,
                iconURL: message.member?.displayAvatarURL()
            })
            .setTimestamp()
            .setTitle("Command details: ")
            .setDescription(`Name: \`${cmd.name}\`\nDescription: \`${cmd.description}\`\nUsage: \`${cmd.usage}\`\nAliases: \`${cmd.aliases ? cmd.aliases.join(",") : "No aliases"}\``)
            .setThumbnail(client.user?.displayAvatarURL() || null);
            await message.channel.send({
                embeds: [embed]
            });
        }
    },
    usage: `help [command](Optional)`
}

export default command