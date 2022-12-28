const { Client, IntentsBitField } = require("discord.js");
const { token, guilds } = require("./config.json");
const fs = require('fs');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessageReactions
    ]
})


client.on("ready", async () => {
    console.log("Bot ready ! Developped by flav#2200");

    for (const guildConf of guilds) {
        const guild = client.guilds.cache.get(guildConf.id);
        if (!guild)
            continue;

        for (const messageConf of guildConf.messages) {

            const channel = guild.channels.cache.get(messageConf.channel_id) || await client.channels.fetch(messageConf.channel_id).catch(() => null);
            if (!channel) {
                console.log(`Invalid channel ID (${messageConf.channel_id}) for message name: (${messageConf.name}) in guild "${guild.name}"`);
                continue;
            }

            let message = messageConf.id ? (messageConf.id.length > 0 ? await channel.messages.fetch(messageConf.id).catch((err) => { console.log(err); return null; }) : null) : null;

            for (const embed of messageConf.message.embeds) {
                embed.color = Number(embed.color);
            }

            if (!message) {
                message = await channel.send(messageConf.message).catch((err) => { console.log(err); return null; });

                if (!message)
                    continue;

                console.log(`Created message with id ${message.id}`);

                fs.readFile('src/config.json', 'utf8', function readFileCallback(err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        const obj = JSON.parse(data);
                        obj.guilds.find(x => x.id === guild.id).messages.find(x => x.name === messageConf.name).id = message.id;
                        json = JSON.stringify(obj);
                        fs.writeFile('src/config.json', json, 'utf8', function (err) {
                            if (err) throw err;
                            // console.log('complete');
                        });
                    }
                });

            } else {
                message.edit(messageConf.message).catch((err) => { console.log(err); return null; });
            }

            for (const reaction of messageConf.reactions) {
                await message.react(reaction.emoji);
            }


        }
    }
});


async function manageReaction(reaction, user, add) {
    // console.log(reaction, user);
    const message = reaction.message;
    const emoji = reaction._emoji;
    const guild = message.guild;
    const messageConf = guilds.find(x => x.id === message.guildId)?.messages.find(x => x.id === message.id);
    if (!messageConf)
        return;

    const reactionConf = messageConf.reactions.find(x => x.emoji === `${emoji.animated ? "a:" : ""}${emoji.name}:${emoji.id}`);
    if (!reactionConf)
        return;

    const role = reactionConf.role_id ? (reactionConf.role_id.length > 0 ? await message.guild.roles.fetch(reactionConf.role_id).catch((err) => { console.log(err); return null; }) : null) : null;

    if (!role) {
        console.log(`Invalid role ID (${reactionConf.role_id}) for message name: (${messageConf.name}) in guild "${guild.name}"`);
        return;
    }

    const member = guild.members.cache.get(user.id) || await message.guild.member.fetch(user.id).catch((err) => { console.log(err); return null; });

    if (!member) {
        console.log(`Unable to find the member with id ${user.id} => ${user.username}`);
        return;
    }

    if (add) {
        member.roles.add(role.id, "Added by the reaction roles");
        return;
    }

    member.roles.remove(role.id, "Removed by the reaction roles");

}


client.on("messageReactionAdd", (reaction, user) => {
    manageReaction(reaction, user, true)
});


client.on("messageReactionRemove", (reaction, user) => {
    manageReaction(reaction, user, false)
});


client.login(token);