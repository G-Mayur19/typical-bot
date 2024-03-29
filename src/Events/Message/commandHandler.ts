import { Event } from "../../Interfaces/Event";
import { ActivityType, Message } from "discord.js";
import { Command } from "../../Interfaces/Command";
import { Bot } from "../../Client";
import { OwnerDB } from "../../Models/owner"; 

const event: Event = {
    event: "messageCreate",
    async run(client, message: Message) {
        if(message.author.bot) return;
        if(!message.guild) return;
        if(!message.content.startsWith(client.prefix)) return;
        const args = message.content.slice(client.prefix.length).trim().split(/ +/g);
        if(!args[0]) return message.reply(`Use \`${client.prefix + "help"}\` to see the available commands!`)
        const cmd = client.getCmd(client, args[0].toLowerCase(), false)
        let data = await OwnerDB.findOne({ userId: client.config.Owner });
        if(!data) {
            data = await OwnerDB.create({ userId: client.config.Owner })
        }
        if(!cmd) return message.reply("Command not found lmao!");
        if(client.checkCommand(cmd)) {
            if(data.Cmds.includes(cmd.name)) return message.reply("Command is currently disabled!");
            await runCmd(cmd, message, client, args)
        } else {
            return;
        }
    }
}

export default event
async function runCmd(cmd: Command, msg: Message, client: Bot, args: string[]) {
    if(cmd.ownerOnly && msg.author.id !== client.config.Owner) return msg.reply("You cannot run this cmd lol.");
    if(cmd.testOnly && !client.config.Devs.includes(msg.author.id)) return msg.reply("You cannot run this cmd lol.");
    try {
        args.shift()?.toLowerCase();
        await cmd.run(client, msg, args)
    } catch (error) {
        console.log(error)
    }
}
