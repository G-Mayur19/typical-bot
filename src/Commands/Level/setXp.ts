import { Command } from "../../Interfaces/Command";
import { EmbedBuilder } from "discord.js";
import { CalcRequiredXP } from "../../Functions/requiredXp";
import { LevelDB } from "../../Models/level";

const command: Command = {
    name: "set-xp",
    description: "Set XP to the user!",
    usage: "setXp (user) (XP)",
    run: async(client, message, args) => {
        if(!message.mentions.users) return message.reply("Mention a user to give Xp.");
        if(!args[1]) return message.reply("XP must be a number!");
        const user = message.mentions.users.first();
        if(!user || user.bot) return message.reply("Cannot edit this users Xp.");
        const XP = Number(args[1])
        const data = await LevelDB.findOne({
            userId: user.id
        });
        if(!data) return message.reply(`${user} hasn't started earning XP yet!`);
        const reqXp = CalcRequiredXP(data.Level);
        if(XP >= reqXp) return message.reply(`You can only give ${reqXp - 1} XP to the user!`);
        data.XP = XP;
        await data.save();
        message.channel.send(`${user} XP has been set to ${XP}`);

    },
    testOnly: true
}

export default command