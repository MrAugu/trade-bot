// Load our library and prefix and the cooldowns map
const Discord = require("discord.js");
const pref = require('../config.json').prefix;
const cooldowns = new Discord.Collection();
// In this event the magic happens, commands are being handled, af
module.exports.execute = async (client, message) => {
    // Instead of typing message.channel.send('HI!'); to send 'HI!' you'll only need to reply('HI!'); to send 'HI!' 
  const reply = c => message.channel.send(c);

  // Ignore Bots
  if (message.author.bot) return;

  // Basically if bot is mentioned at the beggining of message it will tell you the prefix.
  const prefixHelp = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(prefixHelp)) {
      return reply(`Hey, my prefix is \`*\`.`);
    }
  // If message dosen't start with our prefix (*) we will simply stop execute anything. (There is no sense in wasting more resources.)
  if (message.content.toLowerCase().indexOf(pref) !== 0) return;

  // Slice the message and grab da args.
  const args = message.content.slice(pref.length).split(/ +/);

  // Grab the command name from message
  const commandName = args.shift().toLowerCase();

  // Lookup for the command and its file, if fails, it will try search for an asset of any command.
  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  // No command? Stop right here! (Again, there is no sense in wasting more resources.)
  if(!command) return;

  // If the command is marked as unusable in DMs and the channel.. is a DM, it will return a message.
  if (command.guildOnly && message.channel.type !== 'text') {
    return reply('<:uncheck:515840843933024256> I can\'t execute this command inside of DMs.');
  }

  // Firstly, search if the command is marked as requiring other arguments and if the command needs arguments and there are no arguments it will run code block below.
  if (command.args && !args.length) {
    // First part of message.
    const reply = `<:uncheck:515840843933024256> You didn't provide any arguments.`;
    // An empty variable we will use in a bit.
    let propper;

    // If the command configuration provides an usage option charge empty vartiable with it.
    if (command.usage) {
    propper = `Usage: \`${pref}${command.name} ${command.usage}\``;
    }
    
    // Finnaly we compouse our messages with the declared variables.
    return message.channel.send(`${reply}\n${propper || 'No proper usage specifyed.'}`);
    }

  /*
    Now lets get into our fancy cooldown system.
  */

  // If the command ran is not present in cooldown collection, insert it. 
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  // Get curent date, command cooldown from collection, and cooldown amount
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = command.cooldown;
  
  // Now here is my selfish filter, it bypasses the cooldown system for only me.
  if(message.author.id !== '414764511489294347') {
    // If author isn't in cooldown list, we add it and we set a timer to remove it. 
    if (!timestamps.has(message.author.id)) {
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    } else {
      // If author is in cooldown list (means is still on cooldown we notify him that is on cooldown and return)
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return reply(`<:uncheck:515840843933024256> Slow it down buddy. You have to wait ${timeLeft.toFixed(1)} more seconds before using \`${command.name}\` again.`);
      }
    
      timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
      }
    }

  try {
    // If the user avatar isnt exist, 'create' it and try run the command, with typing efect, if an error occurs, it simply notify user that there is an error.
    await message.channel.startTyping();
    if(message.author.avatarURL === null) message.author.avatarURL = "https://mraugu.ga/avam_assets/pfp.png";
    await command.execute(client, message, args, reply);
    await message.channel.stopTyping();
  } catch (err) {
    reply(`<:outage:466296436238188544> Internal error occured!\nError]: \`${err}\`\nPlease report this error to the developers.`);
  }
}