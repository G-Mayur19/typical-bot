import { Slash } from "../../Interfaces/Slash";
import { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, ChannelType, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

const slash: Slash = {
    data: {
        name: "button-roles",
        description: "Colour roles setup",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: "channel",
                description: "Channel to send the message.",
                type: ApplicationCommandOptionType.Channel,
                required: true,
            },
            
        ]
    },
    ownerOnly: true,
    usage: "button-roles",
    async run(client, interaction) {
        const { options, guild, user } = interaction;
        if(!guild) return interaction.reply({
            content: `Command can only be ran in a server!`,
            ephemeral: true
        });
        const channelId = options.getChannel("channel", true).id;
        const channel = guild.channels.cache.get(channelId);
        if(!channel || !channel.isTextBased() || channel.type !== ChannelType.GuildText) return interaction.reply({
            content: `Channel ${channel} is not a text-based channel`
        });

        await interaction.deferReply();
        // My own custom embed, customize it as much as you want!
        const embed = new EmbedBuilder()
        .setColor("Yellow")
        .setTitle("Roles: ");

        // Action Row
        const row = new ActionRowBuilder<StringSelectMenuBuilder>();
        const ColorSelectMenu = new StringSelectMenuBuilder()
        .setCustomId("role-color")
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions(
            new StringSelectMenuOptionBuilder()
            .setLabel("Red")
            .setEmoji("🔴")
            .setValue("Red"),
            new StringSelectMenuOptionBuilder()
            .setLabel("Blue")
            .setEmoji("🔵")
            .setValue("Blue"),
            new StringSelectMenuOptionBuilder()
            .setLabel("Green")
            .setEmoji("🟢")
            .setValue("Green"),
            new StringSelectMenuOptionBuilder()
            .setLabel("Black")
            .setEmoji("⚫")
            .setValue("Black"),
            new StringSelectMenuOptionBuilder()
            .setLabel("White")
            .setEmoji("⚪")
            .setValue("White"),
        );

        const buttonRow = new ActionRowBuilder<ButtonBuilder>();
        const button1 = new ButtonBuilder()
        .setCustomId("announcements")
        .setLabel("Announcements")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("📢");
        const button2 = new ButtonBuilder()
        .setCustomId("polls")
        .setLabel("Polls")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("⬆");

        row.addComponents(ColorSelectMenu);
        buttonRow.addComponents( button1, button2 );
        embed.setDescription(`\`📢 Announcements\` for announcements. (includes bot updates)
        \`⬆ Polls\` for polls.\n
        **Colour Roles: **
        Select from the dropdown menu!`);
        await channel.send({
            embeds: [embed],
            components: [row, buttonRow]
        });

        await interaction.editReply({
            content: `Role embed has been sent to channel: ${channel}`
        });

    },
}

export default slash