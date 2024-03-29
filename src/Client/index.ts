import { Client, IntentsBitField, Collection, REST, Routes, ApplicationCommandData } from "discord.js";
import { connect } from "mongoose";
import config from "../../Data/config.json";
import { Command } from "../Interfaces/Command";
import { readdirSync } from "fs";
import { join } from "path";
import { Event } from "../Interfaces/Event"
import { OwnerDB } from "../Models/owner";
import { Slash } from "../Interfaces/Slash";

export class Bot extends Client {
    public commands: Collection<string, Command> = new Collection()
    public aliases: Collection<string, string> = new Collection()
    public prefix: string = "!"
    public config = config
    public slash: Collection<string, Slash> = new Collection()
    constructor() {
        super({
            intents: [
                IntentsBitField.Flags.MessageContent,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildModeration,
                IntentsBitField.Flags.GuildPresences,
                IntentsBitField.Flags.GuildMessageReactions
            ]
        });
    }
    start() {
        this.login(config.Token)
    }

    async loadCmd(cmd: Collection<string, Command>) {
        const data = await OwnerDB.findOne({ userId: config.Owner});
        if(!data) return;
        const path = join(__dirname, "..", "Commands");
        readdirSync(path).forEach((dir) => {
            if(data.Category.includes(dir)) return;
            readdirSync(join(__dirname, ".." ,"Commands", dir)).forEach((file) => {
                const pull: Command = require(`../Commands/${dir}/${file}`).default;
                if(!pull) {
                    return console.warn(`${file} is missing command data!`)
                } else {
                    cmd.set(pull.name, pull);
                    if(pull.aliases) {
                        pull.aliases.forEach(alias => this.aliases.set(alias, pull.name))
                    }
                    console.log(`Command: ${pull.name} loaded.`)
                }
            });
        });
    }
    async loadEvents() {
        const path = join(__dirname, "..", "Events");
        readdirSync(path).forEach((dir) => {
            readdirSync(join(__dirname, "..", "Events", dir)).forEach((file) => {
                const pull: Event = require(`../Events/${dir}/${file}`).default;
                if(!pull) {
                    return console.warn(`${file} is missing event`)
                } else {
                    if(pull.once) {
                        this.once(pull.event, (...args: any) => { pull.run(this, ...args)})
                    } else {
                        this.on(pull.event, (...args: any) => pull.run(this, ...args));
                    }
                        console.log(`Event set: ${file.split(".")[0]}`)
                }
             });
        });
        
    }

    async loadSlash() {
        let cmds: ApplicationCommandData[] = [];
        readdirSync(join(__dirname, "..", "SlashCommands")).forEach((d) => {
            readdirSync(join(__dirname, "..", "SlashCommands", d)).forEach((f) => {
                const pull: Slash = require(`../SlashCommands/${d}/${f}`).default;
                if(!pull) {
                    return console.warn(`${f} is missing slash command data!`)
                } else {
                    cmds.push(pull.data);
                    this.slash.set(pull.data.name, pull);
                }
            });
        });
        return cmds;
    }
    checkCommand(obj: any): obj is Command {
        return obj
    }
    checkSlash(obj: any): obj is Slash {
        return obj
    }
    getCmd(client: Bot, string: String, slash: boolean) {
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
    async sendError(err: string, client: Bot) { // getting client just to make sure no error, if client didn't cache the owner ID
        const owner = client.users.cache.get(client.config.Owner);
        if(!owner) return;
        await owner.send(`${err}`);
    }
}