import { Command } from "../../Interfaces/Command";
import { EmbedBuilder } from "discord.js";
import { OwnerDB } from "../../Models/owner";
import {  readdirSync } from "fs";
import { join } from "path";

const command: Command = {
    name: "enable",
    description: "Enable a command or category!",
    usage: "enable cmd/category [name]",
    async run(client, message, args) {
        const subCMds = ["cmd", 'cat'];
        if(!args[0] || !subCMds.includes(args[0].toLowerCase())) return;
        const data = await OwnerDB.findOne({
            userId: client.config.Owner
        });
        if(!data) {
            OwnerDB.create({
                userId: client.config.Owner
            });
            return message.reply("Created the database run the command again!")
        } else {
            const subCmd = args[0].toLowerCase();
            if(subCmd === "cmd") {
                const choice = args[1].toLowerCase();
                const res = client.getCmd(client, choice, false);
                if(!res) return message.reply("No command found!");
                if(!client.checkCommand(res)) return message.reply("Command does not belong to message category")
                if(!data.Cmds.includes(res.name)) return message.reply("Command is not disabled!");
                const i = data.Cmds.findIndex((v) => v.toLowerCase() === choice);
                data.Cmds.splice(i, 1);
                await data.save();
                message.channel.send(`Command \`${res.name}\` has been enabled!`);
            } else if(subCmd === "cat") {
                const choice = args[1];
                const dirs = readdirSync(join(__dirname, "..", "..", "Commands"));
                if(!dirs.includes(choice)) return message.reply(`
                Category not found!\nAvailable categories: \`${dirs.join(" ")}\``);
                if(!data.Category.includes(choice)) return message.reply("Category is not disabled.");
                const i = data.Category.findIndex((v) => v === choice);
                data.Category.splice(i, 1);
                await data.save();
                message.channel.send(`Category ${choice} has been enabled!\nReload to commands to apply changes!`);
                
            } else {
                return;
            }
        }
    },
    ownerOnly: true
}

export default command