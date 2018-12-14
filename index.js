const Discord = require ("discord.js");
const fs = require("fs");
const client = new Discord.Client({disableEveryone: true});
const config = require("./config.json");

const token = config.token;
const owner = config.owner;
client.commands = new Discord.Collection();

fs.readdir("./cmds/", (err, files) => {

    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0){
      console.log("No commands were detected!");
      return;
    }

    jsfile.forEach((f,) => {
      let props = require(`./cmds/${f}`);
      console.log(`${f} has been loaded!`);
      client.commands.set(props.help.name, props);
    });

  });

  client.on("ready", async () => {
      console.log("READY BOT!");
      await client.user.setActivity(`${client.guilds.size} servers | ${config.prefix}help`, { type: "WATCHING"});
      await client.user.setStatus("online");
  });

  client.on("guildCreate", async (guild) => {
    let joinEmbed = new Discord.RichEmbed()
    .setColor("#156d09")
    .addField("Name: ", `**${guild.name}**`, true)
    .addField("ID: ", `**${guild.id}**`, true)
    .addField("Members: ", `**${guild.memberCount}**`, true)
    .addField("Servers: ", `**${client.guilds.size}**`, true);
    let logsServerJoin = client.channels.get('482295076106797076').send(joinEmbed);

    let chan = await guild.createChannel("sales", "text");
    chan.send("In this channel, advdertisments will be sent! Drag this channel in the desired category and enjoy the broadcasts! See an abuse? Report it at `Treport <USER ID>`");
  });

  client.on("guildDelete", async (guild) => {
    let leftEmbed = new Discord.RichEmbed()
    .setColor("#ff0000")
    .addField("Name: ", `**${guild.name}**`, true)
    .addField("ID: ", `**${guild.id}**`, true)
    .addField("Members: ", `**${guild.memberCount}**`, true)
    .addField("Servers: ", `**${client.guilds.size}**`, true);
    let logsServerLeft = client.channels.get('482295076106797076').send(leftEmbed);
  });


  client.on("message", async message => {
    if(message.author.bot) return;
    if(!message.content.startsWith(config.prefix)) return;

    const BannedGuildsArray = [];
    const BannedUsersArray = [];

    if(BannedGuildsArray.includes(message.guild.id))
    return message.channel.send("Blacklisted server, couldn't perform any commands!");

    if(BannedUsersArray.includes(message.author.id))
    return message.channel.send("Blacklisted user, coudldn't perform any commands!");

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let commandfile = client.commands.get(cmd.slice(config.prefix.length));

    try {
    if(commandfile) commandfile.run(client,message,args);
  } catch(e) {
    return message.channel.send(`<:outage:> Coudln't perform command, please give the bot creator the error bellow in https://discord.gg/6CYZ6nf\nError: \`${e}\``)
  }

});

  client.login(token);
