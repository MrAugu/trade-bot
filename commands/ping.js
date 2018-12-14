const Discord = require("discord.js");

module.exports = {
    name: 'ping',
	  description: 'Check latency of bot and discord.',
    cooldown: 5000,
    aliases: ['pong','latency'],
    async execute(client, message, args, reply) {
      let m = await reply(`<a:loading:485456411447263244> Working!`);
      let embed = new Discord.RichEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setDescription(`<a:eatPing:493384754721456189> Pong!\n\n⏲ Took ${m.createdTimestamp - message.createdTimestamp}MS.\n\n💓 Heartbeat is ${Math.round(client.ping)}MS.`)
        .setColor("BLURPLE")
        .setTimestamp();
      m.edit(embed);
    },
};