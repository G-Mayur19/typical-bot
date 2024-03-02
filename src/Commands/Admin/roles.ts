import { Command } from "../../Interfaces/Command";
import { EmbedBuilder, GuildMember } from "discord.js";

const command: Command = {
    name: "roles",
    description: "Config roles of this server",
    testOnly: true,
    async run(client, message, args) {
        let x = ["add", "remove"];
        if(!args[0] || !x.includes(args[0].toLowerCase())) return message.reply("Mention if you want to add/remove roles!");
        const r = message.mentions.roles.first()?.id || args[1].toString();
        if(!r) return message.reply("Mention a role or id!");
        const role = await message.guild?.roles.fetch(r);
        if(!role) return message.reply("Couldn't find role!");
        if(!message.mentions.members?.first()) return message.reply("Mention the user to add the role!");
        const members = message.mentions.members?.values()
        switch (args[0].toLowerCase()) {
            case "add":
                let s = 0;
                let f = 0;
                let string = `Added ${role.name} to: \n`;
                for (const member of members) {
                    if(member.roles.cache.has(role.id)) {
                        f++;
                        string += `Failed: \`${member.user.tag}\`\n`
                    } else {
                        await roleEdit(role.id, member, true);
                        string += `\`${member.user.tag}\`\n`;
                        s++
                    }
                }
                message.channel.send(`Failed: ${f} | Success: ${s}\n${string}`);
                break;
            case "remove" :
                let S = 0;
                let F = 0;
                let STRING = `Removed ${role.name} from: \n`;
                for (const member of members) {
                    if(!member.roles.cache.has(role.id)) {
                        F++
                        STRING += `Failed: \`${member.user.tag}\`\n`
                    } else {
                        await roleEdit(role.id, member);
                        STRING += `\`${member.user.tag}\`\n`;
                        S++
                    }
                }
                message.channel.send(`Failed: ${F} | Success: ${S}\n${STRING}`);
            break;
        }
    },
    usage: `roles [add/remove] [role] ...members[max: 10]`
}   

export default command;
async function roleEdit(role: string, member: GuildMember, add?: boolean) {
    if(add) {
        member.roles.add(role)
    } else {
        member.roles.remove(role)
    }
}