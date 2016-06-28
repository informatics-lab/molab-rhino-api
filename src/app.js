var logger = require('./log').logger;
var log = new logger("app");

var express = require('express');
var path = require('path');

var Twitter = require('twitter');
var ThemeServer = require('./themes').themeServer;
var Display = require('./display').pythonServerDisplay;


var display = new Display("http://test.com", 10);
var themeServer = new ThemeServer(display);

// read in credentials from env variables
var credentials = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_TOKEN_SECRET
};

const KEYWORD = "javascript";

var client = new Twitter(credentials);
var stream = client.stream('statuses/filter', {track: keyword, lang: "en"});


stream.on('data', function (tweet) {
    log.info("Tweet from @{}:\n{}", [tweet.user.screen_name, tweet.text]);
    tweet.entities.hashtags.forEach(function (hashtag) {
        var tag = hashtag.text.toLowerCase();
        if (tag != KEYWORD) {
            log.trace("Stripped hashtag : {}", [hashtag.text]);
            Object.getOwnPropertyNames(themeServer).forEach(function (theme) {
                if (tag === theme) {
                    log.trace("Hashtag {} matched theme");
                    themeServer[theme]();
                }
            });
        }
    });
});

stream.on('error', function (error) {
    log.error("error", error);
    throw error;
});

//express stuff for web server
var app = express();
app.use(express.static(path.join(__dirname, '../public')));

module.exports = app;