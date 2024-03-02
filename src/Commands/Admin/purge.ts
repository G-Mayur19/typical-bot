import { Command } from "../../Interfaces/Command";
import { EmbedBuilder, ChannelType } from "discord.js";

const command: Command = {
    name: "purge",
    description: "Purge command",
    async run(client, message, args) {
        if(!message.member?.permissions.has("Administrator")) return message.reply("You cannot use this command!");
        const number = Number(args[0]);
        if(!number || number >= 100) return message.reply("Specify the amount of messages you want to delete.\nMax: 99");
        if(message.channel.type !== ChannelType.GuildText) return message.reply("Command can only be run in a server!");
        await message.channel.bulkDelete(number + 1);
        
    },
    usage: 'purge (amount[max99])'
}

export default command