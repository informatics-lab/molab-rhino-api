var logger = require('../log/index').logger;
var log = new logger("themes.themeCache");

const POLLING_INTERVAL = 1000;

module.exports = function (themeServer) {

    log.info("New theme cache constructed");

    var cache = [];

    var pollCache = setInterval(function() {
        if(cache.size() > 0){
            log.debug("Invoking theme [{}]", [cache[0]]);
            themeServer[cache[0]]();
        }
    }, POLLING_INTERVAL);
    
    return {
        add : function (theme) {
            cache.push(theme);
        },

        priorityAdd : function (theme) {
            cache.splice(0, 0, theme);
        },

        clear : function () {
            cache = [];
        },

        size : function () {
            return cache.length;
        }
    }

};