var logger = require('../log/index').logger;
var log = new logger("themes.themeServer");

var Color = require('color');


module.exports = function(display) {

    return {
        red : function() {
            log.info("Setting all pixels to red");
            display.setAllPixelsToColor(Color("red"));
        },
        green : function () {
            log.info("Setting all pixels to green");
            display.setAllPixelsToColor(Color("green"));
        },
        blue : function () {
            log.info("Setting all pixels to blue");
            display.setAllPixelsToColor(Color("blue"));
        }
    }
    
};