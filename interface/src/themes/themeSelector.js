var logger = require('../log/index').logger;
var log = new logger("themes.themeSelector");
var Color = require('color');
var correctStringArray = require('./data/correct.json');
var incorrectStringArray = require('./data/incorrect.json');
var currentThemes = require('./data/theme-index.json');

const COLOR_FLASH_LENGTH = 3000;

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

    return {

        guessTheme : function(guess) {
            setInterupt ();
            currentThemes.forEach(function(theme) {
                if (guess === theme.name) {
                    log.debug("{} matched theme {}",[guess, theme.name]);
                    if ('programmed' === theme.type) {
                        log.debug("using programmed theme [{}]", [JSON.stringify(theme)]);
                        green().then(function(){
                            return themeServer[guess]();
                            }).then(function(){
                                off();
                            });
                        return true;
                    }
                    else {
                        green();
                        log.debug("emitting theme object [{}]", [JSON.stringify(theme)]);
                        eventEmitter.emit('mediaTheme', theme);
                        return true;
                    }
                }
            });
            return false;
        },

        selectTheme : function(selectedTheme) {
            setInterupt ();
            currentThemes.forEach(function(theme) {
                if (selectedTheme === theme.name) {
                    if ('programmed' === theme.type) {
                        blue().then(function(){
                            return themeServer[selectedTheme]();
                            }).then(function(){
                                off();
                            });
                    }
                    else {
                        blue();
                        eventEmitter.emit('mediaTheme', theme);
                    }
                }
            });
        },

        selectColor : function(color) {
            setInterupt ();
            display.setAllPixelsToColor(Color(color));
        },

        selectColorStringArray : function(colorStringArray) {
            // setInterupt();
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
