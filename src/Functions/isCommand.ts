import { Command } from "../Interfaces/Command";

export function isCommand(obj: any): obj is Command {
    return obj
}