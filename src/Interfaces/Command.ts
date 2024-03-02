import Discord from "discord.js";
import { Bot } from "../Client";

function Run(client: Bot, message: Discord.Message, args: string[]) {}

export interface Command {
    name: string,
    description: string,
    usage: string,
    run: typeof Run,
    aliases?: string[],
    ownerOnly?: boolean,
    testOnly?: boolean
}