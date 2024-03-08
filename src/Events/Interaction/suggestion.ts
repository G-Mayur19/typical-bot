import { Event } from "../../Interfaces/Event";
import { ActionRowBuilder, ActivityType, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, Interaction } from "discord.js";
import { suggestionDB } from "../../Models/suggestion";

const event: Event = {
    event: "interactionCreate",
    async run(client, interaction: Interaction) {
        if(!interaction.guild) return;
        if(interaction.isModalSubmit()) {
            if(interaction.customId === "suggestionModal") {
                const data = await suggestionDB.findOne({
                    userId: interaction.user.id
                });
                if(!data) return interaction.reply({
                    content: `There was an error\nPlease try again later!`,
                    ephemeral: true
                });
                await interaction.reply({
                    content: `Your suggestion was received!`,
                    ephemeral: true
                });
                const suggestion = interaction.fields.getTextInputValue("suggestionInput");
                const embed = new EmbedBuilder()
                .setTitle(`Suggestion by ${interaction.user.username}.`)
                .setColor("Yellow")
                .addFields(
                    {
                        name: "Type: ",
                        value: data.Type
                    },
                    {
                        name: "Suggestion: ",
                        value: suggestion
                    },
                    {
                        name: "Votes",
                        value: `0`
                    }
                );
                const button1 = new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId("yes")
                .setEmoji("👍")
                const button2 = new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId("no")
                .setEmoji('👎')
                const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(button1, button2);
                const suggestionChannel = interaction.guild.channels.cache.get("1213561000289370132") // it must be your channel ID
                if(!suggestionChannel || suggestionChannel.type !== ChannelType.GuildText) return;
                const msg = await suggestionChannel.send({
                    embeds: [embed],
                    components: [row]
                });
                data.MsgID = msg.id;
                await data.save()

            }
        } else if(interaction.isButton()) {
            const IDS = ["yes", "no"];
            if(!IDS.includes(interaction.customId)) return;
            const data = await suggestionDB.findOne({
                MsgID: interaction.message.id
            });
            if(!data) return interaction.reply({
                content: `Data for this suggestion not found!`,
                ephemeral: true
            });
            if(data.userId === interaction.user.id) return interaction.reply({
                content: `You cannot vote your own suggestion!`,
                ephemeral: true
            });
            if(data.Voters.includes(interaction.user.id)) return interaction.reply({
                content: `You have already voted!`,
                ephemeral: true
            });
            data.Voters.push(interaction.user.id);
            const embed = interaction.message.embeds[0];
            const editEmbed = EmbedBuilder.from(embed);
            if(!embed || !editEmbed.data) return;
            if(interaction.customId === "yes") {
                data.UpVotes++;
                await data.save();
                interaction.reply({
                    content: `Upvoted the suggestion`,
                    ephemeral: true
                });         
            } else if(interaction.customId === "no") {
                data.DownVotes++;
                await data.save();
                interaction.reply({
                    content: `Downvoted the suggestion`,
                    ephemeral: true
                });
            }
            const votes = data.UpVotes - data.DownVotes;
            const signOfVote = Math.sign(votes);
            const valueOfEmbed = editEmbed.data.fields;
            if(!valueOfEmbed) return; 
            if(signOfVote === 0) {
                editEmbed.setColor("Yellow")
                valueOfEmbed[2].value = `${votes}`
            } else if(signOfVote === 1) {
                editEmbed.setColor("Green")
                valueOfEmbed[2].value = `${votes}`

            } else if(signOfVote === -1) {
                editEmbed.setColor("Red")
                valueOfEmbed[2].value = `${votes}`

            }
            await interaction.message.edit({
                embeds: [editEmbed]
            })
        }
    },
}

export default event