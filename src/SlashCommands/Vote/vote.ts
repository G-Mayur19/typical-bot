import { Slash } from "../../Interfaces/Slash";
import { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, ButtonBuilder, ActionRowBuilder, ButtonStyle, ChannelType } from "discord.js";
import { OwnerDB } from "../../Models/owner";
import { VoteDB } from "../../Models/vote";

const slash: Slash = {
    data: {
        name: "vote",
        description: "Vote commands.",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: "config",
                description: "Config voting. [OWNER ONLY]",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "edit",
                        description: "Open/Close voting",
                        type: ApplicationCommandOptionType.String,
                        choices: [
                            {
                                name: "open",
                                value: "open"
                            },
                            {
                                name: "close",
                                value: "close"
                            }
                        ],
                        required: true
                    }
                ]
            },
            {
                name: "result",
                description: "Result of the voting!",
                type: ApplicationCommandOptionType.Subcommand,
            },
            {
                name: "user",
                description: "Vote a user!",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "user",
                        description: "Mention the user you want to vote!",
                        type: ApplicationCommandOptionType.User,
                        required: true
                    }
                ]
            }
        ]
    },
    usage: "vote <option>",
    async run(client, interaction) {
        const { options, guild, user } = interaction;
        if(!guild || !interaction.channel) return;
        const subCommand = options.getSubcommand(true);
        let data = await OwnerDB.findOne({
            userId: client.config.Owner
        });
        if(!data) {
            data = await OwnerDB.create({
                userId: client.config.Owner
            });
        }
        if(subCommand === "config") {
            // Owner only
            if(user.id !== client.config.Owner) return interaction.reply({
                content: `Command is for the owner only!`,
                ephemeral: true
            });
            await interaction.deferReply({ ephemeral: false });
            const choice = options.getString("edit", true);
            if(choice === "open") {
                data.Voting = true;
                await data.save();
                const button = new ButtonBuilder()
                .setCustomId("yes")
                .setLabel("Yes")
                .setStyle(ButtonStyle.Success);
                const button2 = new ButtonBuilder()
                .setCustomId("no")
                .setLabel("No")
                .setStyle(ButtonStyle.Danger)
                const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button, button2);

                const msg = await interaction.followUp({
                    content: `Voting is now open!\nDo you want to announce it?`,
                    components: [row]
                });
                const collector = msg.createMessageComponentCollector({
                    time: 10000,
                    filter: (i) => i.user.id === client.config.Owner,
                    max: 1
                });
                collector.on("collect", async(i) => {
                    if(i.customId === "yes") {
                        const channel = client.channels.cache.get("1202684344406249614") // your announcement channel id
                        if(!channel || channel.type !== ChannelType.GuildText) return;
                        await channel.send(`<@&1214119343718400000> voting has been opened!\nUse \`${client.prefix}vote\` to vote!`);
                        i.reply({
                            content: `Sent announcement`,
                            ephemeral: true
                        });
                    } else {
                        i.reply({
                            content: `Cancelled announcement.`,
                            ephemeral: true
                        })
                    }
                });
                collector.on("end", async(c) => {
                    await msg.edit({
                        components: []
                    });
                });
            } else if(choice === "close") {
                if(data.Voting === false) return interaction.followUp({
                    content: `Voting is not open lmao!`,
                    ephemeral: true
                });
                data.Voting = false;
                await data.save();
                interaction.followUp({
                    content: `Voting is now closed!`
                });
            } else {
                return interaction.followUp("Couldn't find options!")
            }
        } else if(subCommand === "result") {
            if(user.id !== client.config.Owner) return interaction.reply({
                content: `Command is for the owner only!`,
                ephemeral: true
            });
            await interaction.deferReply({ ephemeral: true });
            let datas = await VoteDB.find();
            datas = datas.sort((a, b) => {
                return b.votes - a.votes
            });
            const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("Vote Results!")
            .setTimestamp();
            let desc = ``;
            for (let i = 0; i < datas.length; i++) {
                if(i === 10) return;
                const member = guild.members.cache.get(datas[i].userId);
                if(!member) return;
                desc += `${i + 1}. \`${member.user.username}\` ${datas[i].votes}\n`
            }
            await interaction.followUp({
                content: `Sent results!`
            })
            embed.setDescription(desc);
            await interaction.channel.send({
                embeds: [embed]
            });
            for (const data of datas) {
                data.votes = 0;
                data.voted = false;
                await data.save()
            }
        } else if(subCommand === "user") {
            if(data.Voting === false) return interaction.reply({
                content: `You cannot vote now, try again when it is open!`,
                ephemeral: true
            });
            await interaction.deferReply({ ephemeral: true });
            const voteUser = options.getUser("user", true).id;
            const member = guild.members.cache.get(voteUser);
            if(!member) return; // Likely to not happen
            if(member.id === user.id || member.user.bot) return interaction.followUp(`You cannot vote for yourself or a bot!`);
            let userData = await VoteDB.findOne({
                userId: voteUser
            });
            let voterData = await VoteDB.findOne({
                userId: user.id
            });
            if(!userData) {
                userData = await VoteDB.create({
                    userId: voteUser
                });
            }
            if(!voterData) {
                voterData = await VoteDB.create({
                    userId: user.id
                });
            }
            if(voterData.voted === true) return interaction.followUp(`You have already voted!`);
            voterData.voted = true;
            userData.votes++;
            await voterData.save();
            await userData.save();
            interaction.followUp(`Successfully voted for ${member}`);
        }
    },
}

export default slash