/**
 * Created by fewieden on 28.02.16.
 */
var http = require('http');
var https = require('https');

var tmi = require('tmi.js');
var config = require('./config.js');
var chatters = [];
var raffleTimer;
var raffleUsers = [];

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

var bot = new tmi.client(options);

bot.connect()
    .then(function(){
        bot.action(config.channel, "I'll going to lurk now!");
    });

bot.on("chat", function(channel, user, message, self){
    var response = "";
    if(chatters.indexOf(user.username) == -1){
        response = "Hello @"+user['display-name']+" welcome to this channel. ";
        chatters.push(user.username);
    }

    if(message.substring(0,6) == "!help"){
        bot.action(config.channel, response + "In this channel you can use the command !stack, !uptime and !raffle");
    } else if(message.substring(0,7) == "!stack"){
        bot.action(config.channel, response + "For the Twitch Bot " + config.channel + " is using NodeJS, JS, HTML, CSS, IntelliJ");
    } else if(message.substring(0,8) == "!raffle"){
        if(!raffleTimer){
            raffleTimer = setTimeout(function(){
                var winner = Math.floor((Math.random() * raffleUsers.length));
                winner = raffleUsers[winner];
                bot.action(config.channel, "@" + winner + " won the last raffle. Congratulation Kappa");
                raffleUsers = [];
                raffleTimer = null;
            }, 30000);
            bot.action(config.channel, response + "@" + user['display-name'] + " started a raffle. Type !raffle to join in the next 30 seconds.");
        }
        raffleUsers.push(user.username);
    } else if(message.substring(0,8) == "!uptime"){
        https.get('https://api.twitch.tv/kraken/streams/' + config.channel, (res) => {
            res.on('data', (data) => {
                var created_at = new Date(JSON.parse(data).stream.created_at);
                var now = new Date().getTime();
                var diff = now - created_at;
                var seconds = parseInt((diff / 1000) % 60);
                var minutes = parseInt((diff / (60000)) % 60);
                var hours   = parseInt((diff / (3600000)) % 24);
                bot.action(config.channel, response + config.channel + " is streaming since " +
                    hours + " hours, " +
                    minutes + " minutes, " +
                    seconds + " seconds");
            });

        }).on('error', (e) => {
                console.error(e);
        });
    }
});

/*http.createServer(function(request, response){
    response.writeHeader(200, {"Content-Type": "text/plain"});
    response.write("Hello World");
    response.end();
}).listen(3000);
*/

console.log("Server is running !");