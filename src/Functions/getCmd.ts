import { Bot } from "../Client";

function getCmd(client: Bot, string: String, slash: boolean) {
    const cmd = string.toLowerCase();
    let result;
    if(slash) {
        result = client.slash.get(cmd);
        return result
    } else {
        result = client.commands.get(cmd);
        if(!result) {
            const cmdName = client.aliases.get(cmd);
            if(!cmdName) return;
            result = client.commands.get(cmdName);
        }
        return result
    }
}

export { getCmd }