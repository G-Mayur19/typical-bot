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
        // Use this if you want to register command globally
        const rest = new REST().setToken(client.config.Token);
        const res = await rest.put(
            Routes.applicationCommands(client.config.ClientID),
            { body: cmds }
        );
        // For private commands: 
        // const guild = await client.guilds.fetch(client.config.GuildID) // Make sure you have this
        // await guild.commands.set(cmds)
        // .then((v) => 
        // console.log(`Registered ${cmds.length} slash commands.`)
        // )
        // .catch((e) => console.error(e))
    }
})();

mongoose.connect(client.config.Mongo).then((d) => {
    console.log("Connected to the database!")
});
client.start();