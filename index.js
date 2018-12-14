/*
  Checks if the node version is 8.0.0 or lower, if its it simply throws an error and stop working.
*/
if (process.version.slice(1).split(".")[0] < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

// Requiring Default FileSystem
const fs = require('fs');
// Load Up Library
const Discord = require('discord.js');
// More Fancy Stuff
const { promisify } = require('util');
const readdir = promisify(require("fs").readdir);

// Loading Configuration & Grab The Token from Configuration
const config = require('./config.json');
const token = config.token;

// Reads /commands/ and /events/ to grab the events. If there are none, throws an error. 
const files = fs.readdirSync('./commands');
const events = fs.readdirSync('./events');
if (!files.length) throw Error('No command files found');
if (!events.length) throw Error('No event files found!');

// Defining our Client (The Bot Instance and More Stuff) and the collection commands are stored in.
const client = new Discord.Client();
client.commands = new Discord.Collection();

// Fancy Log Message
const log = message => {
  console.log(`[${new Date().toLocaleString()}] - ${message}`);
};

// Loads The Commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// Init function Loads The Events and run them when are 'trigerred'
const init = async () => {
  const evtFiles = await readdir("./events/");
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    client.on(eventName, (...args) => event.execute(client, ...args));
  
  });
}
// Run the init function.
init();

// Logs how many commands & events we're loaded.
log(`Loaded ${files.length} commands.`);
log(`Loaded ${events.length} events.`);

// Funtion: Converts for example 'hey bro, wassup' to 'Hey Bro, Wassup'
String.prototype.toProperCase = function () {
  return this.replace(/([^\W_]+[^\s-]*) */g, function (txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

// Function: Gets a random object from an array. Ex:
// let array = ['red', 'blue', 'orange'];
// array.random();
// Output: red or blue or orange, one of them.
Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

// Function: Waits a specified time before continue running code.
client.wait = require("util").promisify(setTimeout);

// Crash the bot on uncaughtExceptions, we need to catch them anyway.
process.on("uncaughtException", (err) => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  console.error("Uncaught Exception: ", errorMsg);
  process.exit(1);
});

// Shows us unhandledRejections & details.
process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: ", err);
});

// Obviosuly we need to login ourselves.
client.login(token);