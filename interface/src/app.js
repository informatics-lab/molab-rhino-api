var logger = require('./log').logger;
var log = new logger("app");

var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var swearjar = require('swearjar');

var Twitter = require('twitter');
var Themes = require('./themes');
var ThemeServer = Themes.themeServer;
var ThemeSelector = Themes.themeSelector;
var Display = require('./display').pythonServerDisplay;
// var Display = require('./display').arduinoDisplay;

var EventEmitter = require('events');
var Color = require('color');

// var display = new Display();     //for arduino
var display = new Display("http://192.168.1.2:8000/", 1002); //for Pi
var themeServer = new ThemeServer(display);
var eventEmitter = new EventEmitter(eventEmitter);
var themeSelector = new ThemeSelector(display, themeServer, eventEmitter);


// read in credentials from env variables
var credentials = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_TOKEN_SECRET
};

swearjar.loadBadWords('./config/en_US.json');

const KEYWORD = "technorhino";

var myEventEmitter = new EventEmitter();

// ---COMMENT OUT SECTION IF NO INTERNET CONNECTION ---

var client = new Twitter(credentials);
var stream = client.stream('statuses/filter', {track: KEYWORD});
var history = function() {
    client.get('search/tweets', {q: KEYWORD, since_id:756113900718985200}, function(error, tweets, response) {
        var ordered = tweets.statuses.reverse();
        ordered.forEach(function(historicTweet){
            log.trace("{}",[historicTweet.id]);
            myEventEmitter.emit('tweet', historicTweet);
        });
    })
}

stream.on('data', function (tweet) {
        log.trace("Tweet from @{}:\n{}", [tweet.user.screen_name, tweet.text]);
        tweet.text = swearjar.censor(tweet.text);
        myEventEmitter.emit('tweet', tweet);
        tweet.entities.hashtags.forEach(function (hashtag) {
            var tag = hashtag.text.toLowerCase();
            if (tag != KEYWORD) {
                log.trace("Stripped hashtag : {}", [hashtag.text]);
                if (themeSelector.guessTheme(tag) === true) {
                    themeSelector.selectOff();
                }
                else {
                    themeSelector.incorrect();
                }
            }
            themeSelector.selectOff();
        });
});

stream.on('error', function (error) {
    log.error("Twitter stream error:\n{}", [error]);
});

io.on('connection', function(socket){
    log.debug('Web ui connected');

    myEventEmitter.on('tweet', function(tweet) {
        socket.emit('tweet', tweet);
    });

    eventEmitter.on('interupt', function() {
        socket.emit('interupt');
    });

    eventEmitter.on('mediaTheme', function(theme) {
        socket.emit('mediaTheme', theme);
    });

    socket.on('selectTheme', function(theme) {
        themeSelector.selectTheme(theme);
    });

    socket.on('selectColor', function(color) {
        themeSelector.selectColor(color);
    });

    socket.on('selectOff', function() {
        themeSelector.selectOff();
    });

    socket.on('historicTweets', function() {
        history();
    });

    socket.on('selectColorStringArray', function(colorStringArray) {
        themeSelector.selectColorStringArray(colorStringArray);
    });

    socket.on('error', function(error) {
        // we just dont want it to bomb out so do nothing.
        log.error("Websocket error :\n{}",[error]);
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
