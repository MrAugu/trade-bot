const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
    const msg = await message.channel.send("Pinging Client..");
    msg.edit(`# 🏓\n# Latency: ${msg.createdTimestamp - message.createdTimestamp}MS\n# Discord API: ${Math.round(client.ping)}MS`)
}

module.exports.help = {
  name: "ping"
}
