/**
 * Created by fewieden on 29.02.16.
 */
var config = require('./config.js');
var tmi = require('tmi.js').client(config.options);
var https = require('https');

var bot = {
    init: function(){
        tmi.connect().then(function(){
            bot.chatters = [];
            bot.raffleTimer = null;
            bot.raffleUsers = [];
            bot.followerCount = -1;
            bot.config = config;
            tmi.on("chat", bot.onChat);
            tmi.on("hosted", bot.onHost);
            setInterval(bot.checkForNewFollower, 15000);
            bot.me("I'll going to lurk now!");
        });
    },
    me: function(message){
        tmi.action(config.channel, message);
    },
    onChat: function(channel, user, message){
        var response = "";
        if(bot.chatters.indexOf(user.username) == -1){
            response = "Hello @"+(user['display-name'] || user.name) +" welcome to this channel. ";
            bot.chatters.push(user.username);
        }
        if(message.substring(0,1) == "!"){
            if(message.substring(1,5) == "help"){
                bot.me(response + "In this channel you can use the command !stack, !uptime, !sfx SOUNDNAME and !raffle");
            } else if(message.substring(1,6) == "stack"){
                bot.me(response + "For the Twitch Bot " + config.channel + " is using NodeJS, JS, HTML, CSS, IntelliJ");
            } else if(message.substring(1,7) == "raffle"){
                if(!bot.raffleTimer){
                    bot.raffleTimer = setTimeout(function(){
                        var winner = Math.floor((Math.random() * bot.raffleUsers.length));
                        winner = bot.raffleUsers[winner];
                        bot.me("@" + winner + " won the last raffle. Congratulation Kappa");
                        bot.raffleUsers = [];
                        bot.raffleTimer = null;
                    }, 30000);
                    bot.me(response + "@" + (user['display-name'] || user.name) + " started a raffle. Type !raffle to join in the next 30 seconds.");
                }
                bot.raffleUsers.push(user.username);
            } else if(message.substring(1,7) == "uptime"){
                https.get('https://api.twitch.tv/kraken/streams/' + config.channel, function(res){
                    res.on('data', function(data){
                        var stream = JSON.parse(data).stream;
                        if(stream){
                            var created_at = new Date(stream.created_at);
                            var now = new Date().getTime();
                            var diff = now - created_at;
                            var seconds = parseInt((diff / 1000) % 60);
                            var minutes = parseInt((diff / (60000)) % 60);
                            var hours   = parseInt((diff / (3600000)) % 24);
                            bot.me(response + config.channel + " is streaming since " +
                                hours + " hours, " +
                                minutes + " minutes, " +
                                seconds + " seconds");
                        } else {
                            bot.me(response + config.channel + " is currently offline.")
                        }
                    });
                }).on('error', function(e){
                    console.error(e);
                });
            } else if(message.substring(1,4) == "sfx") {
                if(bot.socket) {
                    var sound = message.split(' ')[1];
                    bot.socket.emit("play-sound", sound);
                }
            }
        } else if(response){
            bot.me(response);
        }
    },
    checkForNewFollower: function(){
        https.get('https://api.twitch.tv/kraken/channels/' + config.channel + '/follows', function(res){
            res.on('data', function(data){
                var total = parseInt(JSON.parse(data)['_total']);
                if (total > bot.followerCount && bot.followerCount != -1){
                    var diff = total - bot.followerCount;
                    var followers = JSON.parse(data).follows;
                    var output = "";
                    for (var i = 0; i < diff; i++){
                        if(i != 0){
                            output += ", ";
                        }
                        output += (followers[i].user['display_name'] || followers[i].user.name);
                    }
                    bot.me(output + (diff == 1 ? " is now following." : " are now following.") + " <3 <3 <3");
                }
                bot.followerCount = total;
            });
        }).on('error', function(e){
            console.error(e);
        });
    },
    onHost: function(channel, username, viewers){
        if(viewers >= 1){
            bot.me(username + " is hosting " + channel + " with " + viewers + " awesome viewers");
        }
    },
    setSocket: function(socket){
        bot.socket = socket;
    }
};

module.exports = bot;