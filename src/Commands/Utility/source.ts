import { Command } from "../../Interfaces/Command";
import { EmbedBuilder } from "discord.js";

const command: Command = {
    name: "source",
    description: "Bot's source code.",
    usage: "source",
    async run(client, message, args) {
        const embed = new EmbedBuilder()
        .setTitle("My source code: ")
        .setDescription(`The bot has a open-source code go check it!\n[Github](https://github.com/G-Mayur19/typical-bot)`) // change to your github!
        .setColor("Blurple")
        .setTimestamp()
        .setFooter({
            text: `Requested by ${message.author.username}`,
            iconURL: message.author.displayAvatarURL()
        });
        await message.channel.send({
            embeds: [embed]
        });
    },
}

export default command