/**
 * Created by fewieden on 29.02.16.
 */
var config = require('./config.js');
var options = {
    options: {
        debug: true
    },
    connection: {
        cluster: "chat",
        reconnect: true,
        secure: true
    },
    identity: {
        username: config.username,
        password: config.password
    },
    channels: ["#"+config.channel]
};
var tmi = require('tmi.js').client(options);
var https = require('https');

var bot = {
    init: function(){
        tmi.connect().then(function(){
            bot.chatters = [];
            bot.raffleTimer = null;
            bot.raffleUsers = [];
            bot.followerCount = -1;
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
            if(message.substring(1,6) == "help"){
                bot.me(response + "In this channel you can use the command !stack, !uptime and !raffle");
            } else if(message.substring(1,7) == "stack"){
                bot.me(response + "For the Twitch Bot " + config.channel + " is using NodeJS, JS, HTML, CSS, IntelliJ");
            } else if(message.substring(1,8) == "raffle"){
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
            } else if(message.substring(1,8) == "uptime"){
                https.get('https://api.twitch.tv/kraken/streams/' + config.channel, (res) => {
                    res.on('data', (data) => {
                        var created_at = new Date(JSON.parse(data).stream.created_at);
                        var now = new Date().getTime();
                        var diff = now - created_at;
                        var seconds = parseInt((diff / 1000) % 60);
                        var minutes = parseInt((diff / (60000)) % 60);
                        var hours   = parseInt((diff / (3600000)) % 24);
                        bot.me(response + config.channel + " is streaming since " +
                            hours + " hours, " +
                            minutes + " minutes, " +
                            seconds + " seconds");
                    });
                }).on('error', (e) => {
                    console.error(e);
                });
            } else if(message.substring(1,8) == "random") {
                if(bot.socket) {
                    console.log('trying to send a message');
                    bot.socket.emit("random", Math.floor((Math.random() * 8)));
                }
            }
        } else if(response){
            bot.me(response);
        }
    },
    checkForNewFollower: function(){
        https.get('https://api.twitch.tv/kraken/channels/' + config.channel + '/follows', (res) => {
            res.on('data', (data) => {
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
        }).on('error', (e) => {
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