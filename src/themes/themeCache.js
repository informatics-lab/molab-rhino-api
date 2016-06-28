var logger = require('../log/index').logger;
var log = new logger("themes.themeCache");


module.exports = function (themeServer) {

    log.info("New theme cache constructed");

    var cache = [];

    var watchCache = function() {

    };
    
    return {
        add : function (theme) {
            cache.push(theme);
        },

        clear : function () {
            cache = [];
        },

        size : function () {
            return cache.length;
        }
    }

};