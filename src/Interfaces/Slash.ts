import { ApplicationCommandData, CommandInteraction } from "discord.js";
import { Bot } from "../Client";

function Run(client: Bot, interaction: CommandInteraction) {};

interface Slash {
    data: ApplicationCommandData,
    run: typeof Run,
    ownerOnly?: boolean,
    devOnly?: boolean,
    usage: string
}

export { Slash }