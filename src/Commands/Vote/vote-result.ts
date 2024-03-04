import { Command } from "../../Interfaces/Command";
import { EmbedBuilder } from "discord.js";
import { VoteDB } from "../../Models/vote";
const command: Command = {
    name: "vote-result",
    description: "Voting results",
    usage: "vote-result",
    ownerOnly: true,
    async run(client, message, args) {
        let datas = await VoteDB.find();
        datas = datas.sort((a,b) => {
            return b.votes = a.votes
        });
        const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Vote Results!")
        .setTimestamp();
        let desc = ``;
        for (let i = 0; i < datas.length; i++) {
            if(i === 10) return;
            const member = message.guild?.members.cache.get(datas[i].userId);
            if(!member) return;
            desc += `${i + 1}. \`${member.user.username}\` ${datas[i].votes}\n`
        }

        embed.setDescription(desc);
        await message.channel.send({
            embeds: [embed]
        });
        for (const data of datas) {
            data.votes = 0;
            data.voted = false;
            await data.save()
        }

    },
}

export default command