var logger = require('../log/index').logger;
var log = new logger("themes.themeSelector");

var Color = require('color');

module.exports = function(display, themeServer) {

    var red = function() {
        log.info("Setting all pixels to red");
        display.setAllPixelsToColor(Color("red"));
    };
    var green = function () {
        log.info("Setting all pixels to green");
        display.setAllPixelsToColor(Color("green"));
    };

    return {
        
        guessTheme : function(guess) {
            Object.getOwnPropertyNames(themeServer).forEach(function (theme) {
                if (guess === theme) {
                    log.trace("{} matched theme",[guess]);
                    green();
                    themeServer[theme]();
                    return;
                }
            });
            red();
        }
        
    }

};