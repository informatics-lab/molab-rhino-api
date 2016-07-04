var logger = require('../log/index').logger;
var log = new logger("themes.themeServer");

var custom = require('./custom');


module.exports = function(display) {
    
    return {
        
        rainbow : function () {
            log.info("Setting all pixels to rainbow");
            return custom.rainbow(display);
        },
        redGreen : function () {
            log.info("Setting all pixels to red-green flash");
            return custom.redGreen(display);
        },
        onePixel : function () {
        log.info("Setting an indiviual pixel");
        return custom.onePixel(display);
        },
    }
    
};