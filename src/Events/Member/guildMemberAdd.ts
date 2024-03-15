import { Event } from "../../Interfaces/Event";
import { ActivityType, ChannelType, EmbedBuilder, GuildMember } from "discord.js";
import { LevelDB } from "../../Models/level";

const event: Event = {
    event: 'guildMemberAdd',
    async run(client, member: GuildMember) {
        if(member.user.bot) return;
        await LevelDB.create({
            userId: member.id,
            Level: 1,
            XP: 0
        });
        const welcomeEmbed = new EmbedBuilder()
        .setTitle(`${member.user.username}, welcome!`)
        .setDescription(
            `Head to <#1205964327153045515> to claim roles\nRemember no swearing!`
        )
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()
        .setColor("Green")
        const welComeChannel = member.guild.channels.cache.get("1202685736109875230");
        if(!welComeChannel || welComeChannel.type !== ChannelType.GuildText) return;
        await welComeChannel.send({
            content: `${member}`,
            embeds: [welcomeEmbed]
        });
        // Optional
        const memberCountChannel = member.guild.channels.cache.get("1202976070001885224");
        if(!memberCountChannel) return;
        const count = member.guild.members.cache.filter((m) => !m.user.bot).size;
        await memberCountChannel.setName(`Members: ${count}`);
        const joinRole = await member.guild.roles.fetch("1202684963846094888");
        if(joinRole) {
            await member.roles.add(joinRole.id);
        } else {
            client.sendError(`Added ${member.user.username}, but didn't find role!`, client);
        }
    }
}

export default event