import { Command } from "../../Interfaces/Command";
import { EmbedBuilder } from "discord.js";
import { OwnerDB } from "../../Models/owner";
import { VoteDB } from "../../Models/vote";

const command: Command = {
    name: "vote",
    description: "Vote a player!",
    usage: "vote <user>",
    async run(client, message, args) {
        const ownerData = await OwnerDB.findOne({
            userId: client.config.Owner
        });
        if(!ownerData || ownerData.Voting === false) return message.reply("Voting has not yet opened!");
        let userData = await VoteDB.findOne({
            userId: message.author.id
        });
        if(!userData) {
            userData = await VoteDB.create({
                userId: message.author.id
            });

        }
        if(userData.voted) return message.reply("You have already voted!");
        const mentionedUser = message.mentions.users.first();
        if(!mentionedUser) return message.reply("Mention a user to vote!");
        if(mentionedUser.bot || mentionedUser.id === message.author.id) return message.reply("You cannot vote for yourself or a bot!");
        let mentionedUserData = await VoteDB.findOne({
            userId: mentionedUser.id
        });
        if(!mentionedUserData) {
            mentionedUserData = await VoteDB.create({
                userId: mentionedUser.id
            });
        }
        userData.voted = true;
        mentionedUserData.votes++;
        await userData.save();
        await mentionedUserData.save();
        await message.channel.send(`Successfully voted for \`${mentionedUser.username}\`.`);

    },
}

export default command