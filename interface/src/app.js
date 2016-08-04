var logger = require('./log').logger;
var log = new logger("app");

var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var swearjar = require('swearjar');

var fs = require('fs');
var ytdl = require('ytdl-core');
var request = require('request');

var Twitter = require('twitter');
var Themes = require('./themes');
var ThemeServer = Themes.themeServer;
var ThemeSelector = Themes.themeSelector;
var Display = require('./display').pythonServerDisplay;
// var Display = require('./display').arduinoDisplay;

var EventEmitter = require('events');
var Color = require('color');

// var display = new Display();     //for arduino
var display = new Display("http://localhost:8000/", 1002); //for Pi
var themeServer = new ThemeServer(display);
var themeSelector = new ThemeSelector(display, themeServer);



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

// Streams a youtube video
function youTube (videoURL) {
    log.trace("video url to download {}", [videoURL]);
    ytdl(videoURL)
      .pipe(fs.createWriteStream('public/data/video.mp4'));
}

function imgDownload (imageURL, callback) {
    log.trace("image url to download {}", [imageURL]);
    request(imageURL)
      .pipe(fs.createWriteStream('public/data/image.png'))
        .on('close', callback);
}

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
                themeSelector.guessTheme(tag);
            }
        });
        tweet.entities.urls.forEach(function (url) {
            if(tweet.entities.urls != undefined) {
                var tweetURL = url.expanded_url;
                log.trace("video url extracted from tweet {}", [tweetURL]);
                youTube(tweetURL);
                vidSource = 'video.mp4';
                myEventEmitter.emit('vidSource', vidSource);
            };
        });
        tweet.entities.media.forEach(function (media) {
            if(tweet.entities.media != undefined) {
                var imageURL = media.media_url;
                log.trace("image url {}", [imageURL]);
                imgDownload(imageURL, function() {
                  imgSource = 'image.png';
                  myEventEmitter.emit('imgSource', imgSource);
                });
            };
        });
});

stream.on('error', function (error) {
    log.error("Twitter stream error:\n{}", [error]);
});

io.on('connection', function(socket){
    log.debug('Web ui connected');

    myEventEmitter.on('tweet', function(tweet){
        socket.emit('tweet', tweet);
    });

    myEventEmitter.on('vidSource', function(vidSource) {
        socket.emit('vidSource', vidSource);
    });

    myEventEmitter.on('imgSource', function(imgSource) {
        socket.emit('imgSource', imgSource);
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
