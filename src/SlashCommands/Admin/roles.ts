import { Slash } from "../../Interfaces/Slash";
import { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, Role, GuildMember } from "discord.js";

const slash: Slash = {
    data: {
        name: "role-config",
        description: "Config user roles.",
        options: [
            {
                name: "choice",
                description: "Pick one of the following: ",
                type: ApplicationCommandOptionType.String,
                choices: [
                    {
                        name: "add",
                        value: "add"
                    },
                    {
                        name: "remove",
                        value: "remove"
                    }
                ],
                required: true
            },
            {
                name: "user",
                description: "Mention the user you want to config roles for.",
                type: ApplicationCommandOptionType.User,
                required: true,

            },
            {
                name: "role",
                description: "Mention the role",
                type: ApplicationCommandOptionType.Role,
                required: true,
            }
        ],
        type: ApplicationCommandType.ChatInput,
    },
    devOnly: true,
    usage: "role-config <choice> <user> <role>",
    async run(client, interaction) {
        const { options, guild } = interaction;
        if(!guild) return interaction.reply({
            content: `Error: Command can only be ran in a server!`,
            ephemeral: true
        })
        const choice = options.get("choice", true).value;
        const user = options.getUser("user", true).id;
        const ROLE = options.getRole("role", true).id;
        const member = await guild.members.fetch(user);
        const role = await guild.roles.fetch(ROLE);
        const embed = new EmbedBuilder();
        if(!member || !role || role.name === "@everyone") {
            embed.setColor("Red").setDescription(`Couldn't config role due to user not found or role not found!`)
            return interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            await interaction.deferReply();
            const res = await RoleEdit(role, member, choice);
            embed.setColor("Green").setDescription(res);
            await interaction.followUp({
                embeds: [embed]
            })
        }
    }
}

export default slash;

async function RoleEdit(role: Role, member: GuildMember, choice: any) {
    let string: string;
    if(choice === "add") {
        if(member.roles.cache.has(role.id)) return string = `${member}, already has the role!`;
        await member.roles.add(role.id);
        string =  `${role.name} has been added ${member}`
    } else if(choice === "remove") {
        if(!member.roles.cache.has(role.id)) return string = `${member}, doesn't have this role!`;
        await member.roles.remove(role.id);
        string =  `${role.name} has been removed from ${member}`
    } else {
        string = `Error: Couldn't config roles!`
    }
    return string;
}