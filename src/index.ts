import { REST, Routes } from "discord.js";
import { Bot } from "./Client";
const client = new Bot();
import mongoose from "mongoose";

(async() => {
    let registerCmd = true;
    await client.loadCmd(client.commands);
    await client.loadEvents();
    if(registerCmd = true) {
        const cmds = await client.loadSlash();
        const rest = new REST().setToken(client.config.Token);
        const res = await rest.put(
            Routes.applicationCommands(client.config.ClientID),
            { body: cmds }
        );
        console.log(`Registered ${cmds.length} slash commands.`)
    }
})();

mongoose.connect(client.config.Mongo).then((d) => {
    console.log("Connected to the database!")
});
client.start();