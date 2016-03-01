/**
 * Created by fewieden on 28.02.16.
 */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var socket = require('socket.io')(http);

var bot = require('./twitchbot.js');
bot.init();

socket.on('connection', function(conn){
    bot.setSocket(conn);
    conn.on('disconnect', function(){
        bot.setSocket(null);
    });
});

require('./router/router.js')(app);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));

var server = http.listen(3000, function(){
    console.log("Server is running !");
});