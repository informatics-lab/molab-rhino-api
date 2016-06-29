var logger = require('./log').logger;
var log = new logger("app");

var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var Twitter = require('twitter');
var Themes = require('./themes');
var ThemeServer = Themes.themeServer;
var ThemeSelector = Themes.themeSelector;
var Display = require('./display').pythonServerDisplay;
var EventEmitter = require('events');

var display = new Display("http://172.24.1.1:8000/cgi-bin/panel.py", 80);
var themeServer = new ThemeServer(display);
var themeSelector = new ThemeSelector(display, themeServer);

// read in credentials from env variables
var credentials = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_TOKEN_SECRET
};

const KEYWORD = "javascript";

var myEventEmitter = new EventEmitter();

 var client = new Twitter(credentials);
 var stream = client.stream('statuses/filter', {track: KEYWORD});


 stream.on('data', function (tweet) {
     if (tweet.lang === "en") {
         log.info("Tweet from @{}:\n{}", [tweet.user.screen_name, tweet.text]);
         myEventEmitter.emit('tweet', tweet);
         tweet.entities.hashtags.forEach(function (hashtag) {
             var tag = hashtag.text.toLowerCase();
             if (tag != KEYWORD) {
                 log.trace("Stripped hashtag : {}", [hashtag.text]);
                 themeSelector.guessTheme(tag);
             }
         });
     }
 });

 stream.on('error', function (error) {
     log.error("error", error);
     throw error;
 });


io.on('connection', function(socket){
    log.debug('Web ui connected');
    
    myEventEmitter.on('tweet', function(tweet){
        socket.emit('tweet', tweet);
    });

    socket.on('selectTheme', function(theme) {
        themeSelector.selectTheme(theme);
    });

    socket.on('disconnect', function(){
        log.trace('Web ui disconnected');
    });
});

//serves the standard page.
app.use(express.static(path.join(__dirname, '../public')));

/*
 * Listens for incoming connections on port 3000
 */
http.listen(3000, function(){
    log.info('Server started and listening on 3000');
});