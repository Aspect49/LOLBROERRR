const { Client, Attachment, RichEmbed } = require('discord.js')
const bot = new Client();
const superagent = require('superagent');
const ytdl = require("ytdl-core");
const cheerio = require("cheerio");
const request = require("request");
var servers = {};

const PREFIX = '!';

bot.on('ready', () => {
    console.log('This bot is online');
})

bot.on('guildMemberAdd', member => {

    const channel = member.guild.channels.find(channel => channel.name === "welcome");
    if (!channel) return;

    channel.send(`Welcome to the great Beatboxgaming server ${member}! we hope you have a great time here!`)

});

bot.on('message', message => {

    let args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {
        case 'help':
            message.channel.send('hey! am a bot. yeah nice to meet you! what can i do? hmmm, not that much but i could play some music? Oh and i could send you memes! wanna figure out how? type the command !commands and ill explane')
            break;

        case 'kick':


            if (!message.member.roles.find(r => r.name === "BOSS")) return message.channel.send('You dont have the perms for this command! (deleting this in 5 seconds!)')
                .then(message => message.delete(5000));
            const user = message.mentions.users.first();

            if (user) {
                const member = message.guild.member(user);

                if (member) {
                    member.kick('You where kick from Beatboxgaming, its sad to kick you. but i needa listen to my admins :(').then(() => {
                        message.reply(`Succesfully kicked ${user.tag}`);
                    }).catch(err => {
                        message.reply('I was unable to kick this member');
                        console.log(err);
                    });
                } else {
                    message.reply("That user isn't in this server!")
                }
            } else {
                message.reply("You need to specify a person!");
            }

            break;


        case 'ban':


            if (!message.member.roles.find(r => r.name === "BOSS")) return message.channel.send('You dont have the perms for this command! (deleting this in 5 seconds!)')
                .then(message => message.delete(5000));
            const user2 = message.mentions.users.first();

            if (user2) {
                const member = message.guild.member(user2);

                if (member) {
                    member.ban({ reason: 'you were bad :(' }).then(() => {
                        message.reply(`I banned ${user2.tag} because he was a bad kid :( and i dont like to say that)`)
                    })
                } else {
                    message.reply("That user isn't in this server!")
                }
            } else {
                message.reply("You need to specify a person!");
            }

            break;


        case 'meme':
            meme(message);
            break;

        case 'commands':
            message.channel.send('!meme, !commands, !admintools, !play (YOUTUBE LINK), skip (skips song), stop (stops the hole queue) yeah actually thats it for now (yeah if you are just a normal member, just dont even try !admin tools..')
            break;

        case 'admintools':
            if (!message.member.roles.find(r => r.name === "BOSS")) return message.channel.send('You dont have the perms for this command! kinda stupid you tried, because do you have the name "admin" no? yeah thats what i thought.. (deleting this in 5 seconds!)')
                .then(message => message.delete(5000));
            message.channel.send('!ban, !kick is at the moment our admintools!')
            break;



        case 'play':
             
         function play(connection, message){
             var server = servers[message.guild.id];

             server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));

             server.queue.shift();

             server.dispatcher.on("end", function(){
                 if(server.queue[0]){
                     play(connection, message);
                 }else {
                     connection.diconnect();
                 }
             
                })


         }

            if (!args[1]) {
                message.channel.send("you need to provide a link!");
                return;
            }
                
            if(!message.member.voiceChannel){
                message.channel.send("You must be in a channel to play the bot!");
                return;
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            }

            var server = servers[message.guild.id];

              server.queue.push(args[1]);

            if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function( connection){
                play(connection, message);
            })





            break;

            case 'skip':
                var server = servers[message.guild.id];
                  if(server.dispatcher) server.dispatcher.end();
                  message.channel.send("skipping song!")
                break;

                case 'stop':
                        var server = servers[message.guild.id];
                        if(message.guild.voiceConnection){
                            for(var i = serer.queue.length -1; i >=0; i--){
                                server.queue.splice(i, 1);
                            }

                            server.dispatcher.end();
                            message.channel.send("ending the queue, leaving voicechannel!")
                            console.log('stopped the queue')
                        }

                        if(message.guild.connection) message.guild.voiceConnection.disconnect();
                break;

    }
});

function meme(message) {

    var options = {
        url: "http://results.dogpile.com/serp?qc=images&q=" + "memes",
        method: "GET",
        headers: {
            "Accept": "text/html",
            "User-Agent": "Chrome"
        }
    };

    request(options, function (error, response, responseBody) {
        if (error) {
            return;
        }


        $ = cheerio.load(responseBody);


        var links = $(".image a.link");

        var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));

        console.log(urls);

        if (!urls.length) {

            return;
        }


        message.channel.send(urls[Math.floor(Math.random() * urls.length)]);
    });


}

bot.login(procces.env.token);