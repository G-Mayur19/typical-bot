import { REST, Routes } from "discord.js";
import { Bot } from "./Client";
const client = new Bot();
import mongoose from "mongoose";

(async() => {
    await client.loadCmd(client.commands);
    await client.loadEvents();
})();

mongoose.connect(client.config.Mongo).then((d) => {
    console.log("Connected to the database!")
});
client.start();