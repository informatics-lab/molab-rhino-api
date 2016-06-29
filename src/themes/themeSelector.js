var logger = require('../log/index').logger;
var log = new logger("themes.themeSelector");
var Color = require('color');

const COLOR_FLASH_LENGTH = 3000;

module.exports = function(display, themeServer) {

    var red = function() {
        return new Promise(function(resolve, reject){
            log.info("Setting all pixels to red");
            display.setAllPixelsToColor(Color("red"));
            setTimeout(resolve(), COLOR_FLASH_LENGTH);
        });
    };

    var green = function () {
        return new Promise(function(resolve, reject){
            log.info("Setting all pixels to green");
            display.setAllPixelsToColor(Color("green"));
            setTimeout(resolve(), COLOR_FLASH_LENGTH);
        });
    };

    var blue = function () {
        return new Promise(function(resolve, reject){
            log.info("Setting all pixels to blue");
            display.setAllPixelsToColor(Color("blue"));
            setTimeout(resolve(), COLOR_FLASH_LENGTH);
        });
    };
    
    var off = function () {
        return new Promise(function(resolve, reject){
            log.info("Turning off pixels");
            display.setAllPixelsToColor(Color("black"));
            resolve();
        });
    };

    return {
        
        guessTheme : function(guess) {
            Object.getOwnPropertyNames(themeServer).forEach(function (theme) {
                if (guess === theme) {
                    log.trace("{} matched theme",[guess]);
                    green().then(function(){
                        return themeServer[theme]();
                        }).then(function(){
                            off();
                        });
                    return;
                }
            });
            red().then(function(){
                off();
            });
        },

        selectTheme : function(theme) {
            blue().then(function(){
                return themeServer[theme]();
                }).then(function(){
                    off();
                });
        }
        
    }

};