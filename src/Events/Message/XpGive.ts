import { Event } from "../../Interfaces/Event";
import { ActivityType, Message } from "discord.js";
import { LevelDB } from "../../Models/level";
const cooldown: Set<string> = new Set();
import { CalcRequiredXP } from "../../Functions/requiredXp";

const event: Event = {
    event: "messageCreate",
    async run(client, msg: Message) {
        if(!msg.guild) return;
        if(msg.author.bot) return;
        if(msg.content.startsWith(client.prefix)) return;
        if(cooldown.has(msg.author.id)) return;
        cooldown.add(msg.author.id);
        const XpToAdd = Math.floor(Math.random() * 15) + 1;
        const data = await LevelDB.findOne({
            userId: msg.author.id
        });
        if(!data) {
            await LevelDB.create({
                userId: msg.author.id,
                XP: XpToAdd
            });
        } else {
            const TotalXp = data.XP + XpToAdd;
            if(TotalXp > CalcRequiredXP(data.Level)) {
                const newXp = 0;
                data.Level += 1
                data.XP = newXp;
                await data.save();
                msg.channel.send(`GG! <@!${msg.author.id}> you levelled up to ${data.Level}`)
            } else {
                data.XP = TotalXp
                data.save()
            }
        }
        setTimeout(() => {
            cooldown.delete(msg.author.id)
        }, 30 * 1000);
    }
}

export default event