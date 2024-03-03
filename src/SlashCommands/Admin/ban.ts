import { Slash } from "../../Interfaces/Slash";
import { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";

const slash: Slash = {
    data: {
        name: "ban",
        description: "Ban commands.",
        defaultMemberPermissions: "Administrator",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: "config",
                description: "Choose one of the above",
                type: ApplicationCommandOptionType.String,
                choices: [
                    {
                        name: "revoke",
                        value: "revoke"
                    },
                    {
                        name: "enact",
                        value: "ban"
                    }
                ],
                required: true
            },
            {
                name: "user",
                description: "User you want to ban/revoke ban",
                type: ApplicationCommandOptionType.Mentionable,
            }
        ],
    },
    async run(client, interaction) {
        const { user, guild, options } = interaction;
        const choice = options.get("config", true);
        if(!interaction.channel) return interaction.reply({ 
            content: `This command can only be ran in a channel`,
            ephemeral: true
        });
        if(choice.value === "revoke") {
            await interaction.reply({
                content: `${user}, please send the ID of the user, who you want to unban.\nYou have 30 seconds`
            });
            const collector = await interaction.channel.createMessageCollector({
                time: 30 * 1000,
                filter: (m) => m.author.id === user.id,
                max: 1,

            });

            collector.on('end', async(collected) => {
                if(!collected) {
                    interaction.editReply(`Could not find ID. Please try again!`)
                } else {
                    const id = collected.first();
                    if(!id) {
                        interaction.editReply(`Failed: ID provided was not found.`)
                    } else {
                        const member = await guild?.members.cache.get(id?.content);
                        if(!member) {
                            await guild?.members.unban(id.content)
                            interaction.editReply({
                                content: `The user provided was unbanned!`
                            });
                        } else {
                            interaction.editReply({
                                content: `User is not banned!`
                            })
                        }
                    }
                    return;
                }
                return;
            });
        } else if(choice.value === "ban") {
            const user = options.getUser("user", true);
            if(!user) return interaction.reply(`Please mention a user for banning!`)
            const member = await guild?.members.fetch(user.id);
            if(!member || !member.bannable) {
                return interaction.reply({
                    content: `Could not find member!`,
                    ephemeral: true
                });
            }
            await member.ban();
            interaction.reply(`User ${user.username} is banned!`)
        }
    },
    usage: "ban [config] [user]"
}

export default slash