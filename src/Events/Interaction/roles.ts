import { Event } from "../../Interfaces/Event";
import { ActivityType, ButtonInteraction, Guild, GuildMember, Interaction, StringSelectMenuInteraction } from "discord.js";

const colorRoles = [
    {
        name: "Black",
        ID: "1214130965077827604"
    },
    {
        name: "Red",
        ID: "1205964728070049822"
    },
    {
        name: "Green",
        ID: "1205964718976667658"
    },
    {
        name: "Blue",
        ID: "1205965065011068998"
    },
    {
        name: "White",
        ID: "1214130875571372072"
    }
];
const roleCustomIDs = ["polls", "announcements"]

const event: Event = {
    event: "interactionCreate",
    async run(client, interaction: Interaction) {
        if(!interaction.guild) return;
        const member = await interaction.guild.members.fetch(interaction.user.id);
        if(!member) return;
        if(interaction.isButton()) {
            const { customId, guild, user } = interaction;
            if(!roleCustomIDs.includes(customId)) return;
            const res = await Role(member, customId, guild);
            if(!res) return interaction.reply({
                content: `There has been an error,\nPlease inform <@!${client.config.Owner}>`,
                ephemeral: true
            });
            await interaction.reply({
                content: res,
                ephemeral: true
            })
        } else if(interaction.isStringSelectMenu()) {
            if(interaction.customId === "role-color") {
                const { customId, guild, user } = interaction;
                const { values } = interaction;
                const value = values[0];
                if(!value) return;
                const res = await RoleSelectMenu(member, guild, value);
                if(!res) return interaction.reply({
                    content: `There has been an error,\nPlease inform <@!${client.config.Owner}>`,
                    ephemeral: true
                });
                await interaction.reply({
                    content: res,
                    ephemeral: true
                });
            }
        }
    },
}

export default event;

async function Role(member: GuildMember, customId: string, guild: Guild) {
    let result;
    if(customId === "announcements") {
        const role = await guild.roles.fetch("1214119343718400000");
        if(!role) return result = `Role not found\nTry again later.`
        if(member.roles.cache.has(role.id)) {
           await member.roles.remove(role);
           return result = `Removed ${role}`
        } else {
            await member.roles.add(role.id)
            return result = `Added ${role}`
        }
    } else if(customId === "polls") {
        const role = await guild.roles.fetch("1214119388395864104");
        if(!role) return result = `Role not found\nTry again later.`
        if(member.roles.cache.has(role.id)) {
           await member.roles.remove(role);
           return result = `Removed ${role}`
        } else {
            await member.roles.add(role.id)
            return result = `Added ${role}`
        }
    }
    return result;
}

async function RoleSelectMenu(member: GuildMember, guild: Guild, value: String) {
    let result;
    const roleId = colorRoles.find((v) => v.name === value)?.ID;
    if(!roleId) return result = `Failed!\nTry again later!`
    const role = await guild.roles.fetch(roleId);
    if(!role) return result = `Failed!\nTry again later!`
    if(member.roles.cache.has(role.id)) {
        await member.roles.remove(role.id);
        return result = `Removed ${role} colour!`
    } else {
        for (const role of colorRoles) {
            if(member.roles.cache.has(role.ID)) {
                await member.roles.remove(role.ID)
                result = `Removed \`${role.name}\`\n`
            } else {
                continue;
            }
        }
        await member.roles.add(role.id);
        return result += `Added ${role} colour!`
    }
}