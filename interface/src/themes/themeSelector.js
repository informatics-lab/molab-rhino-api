var logger = require('../log/index').logger;
var log = new logger("themes.themeSelector");
var Color = require('color');
var correctStringArray = require('./data/correct.json');
var incorrectStringArray = require('./data/incorrect.json');
var currentThemes = require('./data/theme-index.json');

const COLOR_FLASH_LENGTH = 1000;

var guessArray = function(stringArray) {
    var array = [];
    stringArray.forEach(function(colorString){
        array.push(Color(colorString));
    });
    return array;
}

module.exports = function(display, themeServer, eventEmitter) {

    var red = function() {
        return new Promise(function(resolve, reject){
            log.info("Setting all pixels to incorrect");
            display.setPixelsToColorArray(guessArray(incorrectStringArray));
            setTimeout(function () {resolve()}, COLOR_FLASH_LENGTH);
        });
    };

    var green = function () {
        return new Promise(function(resolve, reject){
            log.info("Setting all pixels to correct");
            display.setPixelsToColorArray(guessArray(correctStringArray));
            setTimeout(function () {resolve()}, COLOR_FLASH_LENGTH);
        });
    };

    var blue = function () {
        return new Promise(function(resolve, reject){
            log.info("Setting all pixels to blue");
            display.setAllPixelsToColor(Color("blue"));
            setTimeout(function () {resolve()}, COLOR_FLASH_LENGTH);
        });
    };

    var off = function () {
        return new Promise(function(resolve, reject){
            log.info("Turning off pixels");
            display.setAllPixelsToColor(Color("black"));
            resolve();
        });
    };

    var setInterupt = function () {
        eventEmitter.emit('interupt');
        if(global.ledTheme) {
            clearInterval(global.ledTheme);
            global.ledTheme = null;
        }
    };

    var themePicker = function (guess, theme) {
      return new Promise(function(resolve, reject){
        log.debug("{} matched theme {}",[guess, theme.name]);
        if ('programmed' === theme.type) {
            log.debug("using programmed theme [{}]", [JSON.stringify(theme)]);
            green().then(function(){
                return themeServer[guess]();
            }).then(function(){
                off();
            }).then(function(){
                resolve();
                return true;
            });
        }
        else {
            green().then(function(){
                log.debug("emitting theme object [{}]", [JSON.stringify(theme)]);
                eventEmitter.emit('mediaTheme', theme);
            }).then(function(){
                resolve();
                return true;
            });
        }
      });
    }

    return {

        guessTheme : function(guess) {
            setInterupt();
            var correctGuesses = 0;
            currentThemes.forEach(function(theme) {
                if(guess === 'rainbow'){
                    correctGuesses ++;
                    if(theme.name === 'rainbow') {
                        themePicker(guess, theme).then(function(){
                            return true;
                        });
                    }
                }
                else if(guess.includes(theme.name)){
                    correctGuesses ++;
                    themePicker(guess, theme).then(function(){
                        return true;
                    });
                }
            });
            if (correctGuesses === 0) {
                return false;
            }
        },

        selectTheme : function(selectedTheme) {
            setInterupt ();
            currentThemes.forEach(function(theme) {
                if (selectedTheme.includes(theme.name)) {
                    if ('programmed' === theme.type) {
                        blue().then(function(){
                            return themeServer[selectedTheme]();
                            }).then(function(){
                                off();
                            });
                    }
                    else {
                        blue().then(function(){
                            eventEmitter.emit('mediaTheme', theme);
                        });
                    }
                }
            });
        },

        selectColor : function(color) {
            setInterupt ();
            display.setAllPixelsToColor(Color(color));
        },

        selectColorStringArray : function(colorStringArray) {
            var colors = [];
            colorStringArray.forEach(function(colorString) {
                colors.push(Color(colorString));
            });
            display.setPixelsToColorArray(colors);
        },

        incorrect : function() {
            setInterupt();
            red();
        },

        selectOff : function() {
            setInterupt();
            off();
        }

    }

};
