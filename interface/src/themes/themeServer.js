var logger = require('../log/index').logger;
var log = new logger("themes.themeServer");

var custom = require('./custom');


module.exports = function(display) {

    return {
        starry : function () {
            log.info("Setting pixels to stars");
            return custom.starry(display);
        }
    }

};
