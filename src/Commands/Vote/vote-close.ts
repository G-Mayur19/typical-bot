import { Command } from "../../Interfaces/Command";
import { EmbedBuilder } from "discord.js";
import { OwnerDB } from "../../Models/owner";

const command: Command = {
    name: "vote-close",
    description: "Close voting system",
    usage: "vote-close",
    ownerOnly: true,
    async run(client, message, args) {
        const data = await OwnerDB.findOne({
            userId: client.config.Owner
        });
        if(!data || data.Voting == false) return message.reply("Voting is not opened!");
        data.Voting = false;
        await data.save();
        await message.channel.send("Voting has been closed!");
    },
}

export default command