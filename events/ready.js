// Load our library
const Discord = require("discord.js");

module.exports.execute = async (client) => {
  // Setting the game of status of the bot to 'x Servers | *help'
  await client.user.setActivity(`${client.guilds.size} Servers | *help`, { type: "WATCHING" });

  // Setting the status of the user to online (its online by default but sometimes i need to change it and im too lazy to re-type it again)
  await client.user.setStatus("online");

  // Logs that the bot is ready to be used.
  console.log(`Logged in as ${client.user.tag}.`);
}