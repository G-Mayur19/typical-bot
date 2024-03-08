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
                suggestionChannel.send({
                    embeds: [embed],
                    components: [row]
                });
            }
        }
    },
}

export default event