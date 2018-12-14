const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
    message.channel.send("**=== List Of Available Commands ===**\nMy prefix is: `T`\nSyntax: `T<command>`\n\n`sell` | Turns on interactive setup of advertisment.\n`buy` | Turns on interactive setup of advertisment.\n`ping` | Checks bot's latency.\n`help` | Displays this message.\n\nThis bot is MrAugu#9016 product!\nBy using this bot you agree with our terms and conditions!");
}

module.exports.help = {
  name: "help"
}
