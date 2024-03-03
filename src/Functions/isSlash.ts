import { Slash } from "../Interfaces/Slash";

export function isCommand(obj: any): obj is Slash {
    return obj
}