import { Command } from "../../Interfaces/Command";
import { EmbedBuilder } from "discord.js";
import { CalcRequiredXP } from "../../Functions/requiredXp";
import { LevelDB } from "../../Models/level";

const command: Command = {
    name: "set-level",
    description: "Set XP to the user!",
    usage: "set-lvl (user) (level)",
    run: async(client, message, args) => {
        if(!message.mentions.users) return message.reply("Mention a user to set Level.");
        if(!args[1]) return message.reply("Level must be a number!");
        const user = message.mentions.users.first();
        if(!user || user.bot) return message.reply("Cannot edit this user's Level.");
        const Level = Number(args[1])
        const data = await LevelDB.findOne({
            userId: user.id
        });
        if(!data) return message.reply(`${user} hasn't started earning XP yet!`);
        data.Level = Level;
        data.XP = 0;
        await data.save();
        message.channel.send(`${user} Level has been set to ${Level}`);

    },
    testOnly: true,
    aliases: ["set-lvl"]
}

export default command