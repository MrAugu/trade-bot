const Discord = require("discord.js");
const snekfetch = require("snekfetch");

module.exports.run = async (client, message, args) => {
   client.awaitReply = async (message, question, limit = 30000) => {
     const filter = m => m.author.id === message.author.id;
     await message.channel.send(question);
     try {
       const collected = await message.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
       return collected.first().content;
     } catch (e) {
       return false;
     }
   }

   const Option = await client.awaitReply(message, `What do you sell? **(item/world)** You have 30 seconds to anwer!`);
   if (["item"].includes(Option)) {
     const iName = await client.awaitReply(message, `What is the name of the item you sell?`);
     if(iName === false)
     return message.channel.send("Timed Out!");

     if(iName) {

       const isDesc = await client.awaitReply(message, `Please provide a short description of your item! You have 30 seconds to anwer!`);

       if(isDesc === false)
       return message.channel.send("Timed Out!");

       if(isDesc) {
         const ilDesc = await client.awaitReply(message, `Please provide a short description of your item! You have 30 seconds to anwer!`);

         if(ilDesc === false)
         return message.channel.send("Timed Out!");

         if(ilDesc) {
           let BdWd = ["fuck","bitch","asshole","asswipe","shit","anal","vagina","vaginal","faggot","penis","sex","kys","blowjob"];
           if(BdWd.includes(iName))
           return message.channel.send("Your advertistment contains innapropriate words, request denied!");

           if(BdWd.includes(isDesc))
           return message.channel.send("Your advertistment contains innapropriate words, request denied!");

           if(BdWd.includes(ilDesc))
           return message.channel.send("Your advertistment contains innapropriate words, request denied!");

           let api = `https://growstocks.ga/info.php?invest=1&item=${iName}`;
           await snekfetch.get(api).then(r => {
             let body = r.body;
             let nam = body.Item;
             let img = body.icon


            const itmEmbed = new Discord.RichEmbed()
           .setTitle(`${message.author.tag} is selling ${nam}!`)
           .setColor("#235adb")
           .setDescription(`${isDesc}`)
           .setThumbnail(`${img}`)
           .addField("Long Description:", `${ilDesc}`)
           .setFooter(`Announced From Server: ${message.guild.name} (ID: ${message.guild.id})`)
           .setTimestamp();
          message.channel.send(itmEmbed);
             });
          const iSs = await client.awaitReply(message, `The embed above is a preview of your announcement, are you sure you want to send it? If you do so you are agree with our Terms and Conditions! **(yes/no)** You have 30 seconds to answer!`);

          if(iSs === false)
          return message.channel.send("Timed Out!");

          if(["yes"].includes(iSs)) {
            let api = `https://growstocks.ga/info.php?invest=1&item=${iName}`;
            await snekfetch.get(api).then(r => {
              let body = r.body;
              let nam = body.Item;
              let img = body.icon


             const itmEmbed = new Discord.RichEmbed()
            .setTitle(`${message.author.tag} is selling ${nam}!`)
            .setColor("#235adb")
            .setDescription(`${isDesc}`)
            .setThumbnail(`${img}`)
            .addField("Long Description:", `${ilDesc}`)
            .setFooter(`Announced From Server: ${message.guild.name} (ID: ${message.guild.id})`)
            .setTimestamp();
            message.channel.send("Advertisment has been sent!");

            client.guilds.forEach((guild) => {
              let chanel = guild.channels.find(c => c.name === "sales");
              if(!chanel) chanel = guild.channels.find(c => c.name === "trades");
              if(!chanel) chanel = guild.channels.find(c => c.name === "tradebot");
              if(!chanel) chanel = guild.channels.find(c => c.name === "trade");
              if(!chanel) chanel = guild.channels.find(c => c.name === "advertistments");
              if(!chanel) chanel = guild.channels.find(c => c.name === "trade-ads")
              if(chanel) chanel.send(itmEmbed);
            });
          });
          }

          if(["no"].includes(iSs)) {
            message.channel.send("Aborted!");
          }
         }
       }
     }
   }

   if (["world"].includes(Option)) {
     //WORLD
     const wName = await client.awaitReply(message, `What's the world name you sell? Ex:\`start\` You have 30 seconds to anwer!`);
     if(wName === false)
     return message.channel.send("Timed Out!");

     if(wName) {
       const wsDesc =  await client.awaitReply(message, `Please provide a short description of the world. You have 30 seconds to anwer!`);
       if(wsDesc === false)
       return message.channel.send("Timed Out!");

       if(wsDesc) {
         const wlDesc =  await client.awaitReply(message, `Please provide a long description of the world, please include as much detail. You have 30 seconds to anwer!`);
         if(wlDesc === false)
         return message.channel.send("Timed Out!");

         if(wlDesc) {
           let BadWords = ["fuck","bitch","asshole","asswipe","shit","anal","vagina","vaginal","faggot","penis","sex","kys","blowjob"];

           if(BadWords.includes(wName))
           return message.channel.send("Your advertistment contains innapropriate words, request denied!");

           if(BadWords.includes(wsDesc))
           return message.channel.send("Your advertistment contains innapropriate words, request denied!");

           if(BadWords.includes(wlDesc))
           return message.channel.send("Your advertistment contains innapropriate words, request denied!");

           const wrlEmbed = new Discord.RichEmbed()
           .setTitle(`${message.author.tag} sells ${wName.toUpperCase()} world in growtopia!`)
           .setColor("#235adb")
           .setDescription(`${wsDesc}`)
           .addField("Long Description:", `${wlDesc}`)
           .setImage(`https://s3.amazonaws.com/world.growtopiagame.com/${wName}.png`)
           .setFooter(`Announced From Server: ${message.guild.name} (ID: ${message.guild.id})`)
           .setTimestamp();
           message.channel.send(wrlEmbed);

           const wSs = await client.awaitReply(message, `The embed above is a preview of your announcement, are you sure you want to send it? If you do so you are agree with our Terms and Conditions! **(yes/no)** You have 30 seconds to answer!`);
           if(["yes"].includes(wSs)) {
             message.channel.send("Announcement has been sent!");

             client.guilds.forEach((guild) => {
               let chanel = guild.channels.find(c => c.name === "sales");
               if(!chanel) chanel = guild.channels.find(c => c.name === "trades");
               if(!chanel) chanel = guild.channels.find(c => c.name === "tradebot");
               if(!chanel) chanel = guild.channels.find(c => c.name === "trade");
               if(!chanel) chanel = guild.channels.find(c => c.name === "advertistments");
               if(!chanel) chanel = guild.channels.find(c => c.name === "trade-ads")
               if(chanel) chanel.send(wrlEmbed);
             });

           }
           if(["no"].includes(wSs)) {
             return message.channel.send("Aborted!");
           }

           if(wSs === false)
           return message.channel.send("Timed Out!")
         }
       }
     }
   }

   if(Option === false) {
     return message.channel.send("Timed Out, Aborted!");
   }

}

module.exports.help = {
  name: "sell"
}
