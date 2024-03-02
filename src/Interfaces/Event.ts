import Discord from "discord.js";
import { Bot } from "../Client";

function Run(client: Bot, ...args:any) {}
export interface Event {
    event: keyof Discord.ClientEvents,
    run: typeof Run,
    once?: boolean
}