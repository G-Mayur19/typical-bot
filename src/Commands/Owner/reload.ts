import { Command } from "../../Interfaces/Command";
import { EmbedBuilder } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { OwnerDB } from "../../Models/owner";

const command: Command = {
    name: "reload",
    description: "Reload commands",
    usage: "reload",
    ownerOnly: true,
    async run(client, message, args) {
        const msg = await message.channel.send("Reloading commands...");
        const data = await OwnerDB.findOne({
            userId: message.author.id
        });
        if(!data) return message.reply("Couldn't find data!")
        client.commands.sweep((v, k, c) => true);
        readdirSync(join(__dirname, "..", "..", "Commands")).forEach((dir) => {
            if(data.Category.includes(dir)) return;
            readdirSync(join(__dirname, "..", "..", "Commands", dir)).forEach((file) => {
                delete require.cache[require.resolve(join(__dirname, "..", "..", "Commands", dir, file))];
                const pull: Command = require(`../../Commands/${dir}/${file}`);
                client.commands.set(pull.name, pull);
                if(pull.aliases) {
                    pull.aliases.forEach((a) => client.aliases.set(a, pull.name))
                }
            });

        });
        msg.edit({
            content: `Commands reloaded successfully!`
        })
    }
}

export default command