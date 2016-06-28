var logger = require('./log').logger;
var log = new logger("app");

var express = require('express');
var path = require('path');

var Twitter = require('twitter');
var Themes = require('./themes');
var ThemeServer = Themes.themeServer;
var ThemeSelector = Themes.themeSelector;
var Display = require('./display').pythonServerDisplay;


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

var client = new Twitter(credentials);
var stream = client.stream('statuses/filter', {track: KEYWORD, lang: "en"});


stream.on('data', function (tweet) {
    log.info("Tweet from @{}:\n{}", [tweet.user.screen_name, tweet.text]);
    tweet.entities.hashtags.forEach(function (hashtag) {
        var tag = hashtag.text.toLowerCase();
        if (tag != KEYWORD) {
            log.trace("Stripped hashtag : {}", [hashtag.text]);
            themeSelector.guessTheme(tag);
        }
    });
});

stream.on('error', function (error) {
    log.error("error", error);
    throw error;
});

themeServer["rainbow"]();

//express stuff for web server
var app = express();
app.use(express.static(path.join(__dirname, '../public')));

module.exports = app;