var logger = require('../log/index').logger;
var log = new logger("themes.themeServer");

var custom = require('./custom');


module.exports = function(display) {

    return {

        rainbow : function () {
            log.info("Setting all pixels to rainbow");
            return custom.rainbow(display);
        },
        stars : function () {
            log.info("Setting pixels to stars");
            return custom.stars(display);
        }
    }

};
