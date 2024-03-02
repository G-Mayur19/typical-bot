import { Event } from "../../Interfaces/Event";
import { ActivityType, Message } from "discord.js";
import { Command } from "../../Interfaces/Command";
import { Bot } from "../../Client";
import { OwnerDB } from "../../Models/owner"; 

const event: Event = {
    event: "messageCreate",
    async run(client, message: Message) {
        const msg = message;
        if(message.author.bot) return;
        if(!message.guild) return;
        if(!message.content.startsWith(client.prefix)) return;
        const args = message.content.slice(client.prefix.length).split(/ +/g);
        const cmd = client.commands.get(args[0].toLowerCase());
        const data = await OwnerDB.findOne({ userId: client.config.Owner });
        if(!data) {
            return await OwnerDB.create({ userId: client.config.Owner })
        }
        if(!cmd) {
            const newCmd = client.aliases.get(args[0].toLowerCase());
            if(!newCmd) return message.reply("Couldn't find command lmao");
            const CMD = client.commands.get(newCmd);
            if(!CMD) return message.reply("Couldn't find command lmao");
            if(data.Cmds.includes(CMD.name)) return message.reply("Command is currently disabled!")
            args.shift()?.toLowerCase()
            await runCmd(CMD, msg, client, args)
        } else {
            if(data.Cmds.includes(cmd.name)) return message.reply("Command is currently disabled!")
            args.shift()?.toLowerCase()
            await runCmd(cmd, message, client, args)
        }
    }
}

export default event
async function runCmd(cmd: Command, msg: Message, client: Bot, args: string[]) {
    if(cmd.ownerOnly && msg.author.id !== client.config.Owner) return msg.reply("You cannot run this cmd lol.");
    if(cmd.testOnly && !client.config.Devs.includes(msg.author.id)) return msg.reply("You cannot run this cmd lol.");
    try {
        await cmd.run(client, msg, args)
    } catch (error) {
        console.log(error)
    }
}