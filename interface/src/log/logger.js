var pyformat = require('pyformat');

var colorReset = "\x1b[0m";
var pid = process.pid;

var level = {
    trace: {
        value: 0,
        name: "TRACE",
        color: "\x1b[32m" //green
    },
    debug: {
        value: 10,
        name: "DEBUG",
        color: "\x1b[34m" //blue
    },
    info: {
        value: 20,
        name: "INFO ",
        color: "\x1b[33m" //yellow
    },
    warn: {
        value: 30,
        name: "WARN ",
        color: "\x1b[31m" //red
    },
    error: {
        value: 40,
        name: "ERROR",
        color: "\x1b[37m", //white
        bgColor: "\x1b[41m" //red
    }
};

module.exports = function (name) {

    if (!global.LogLevel) {
        global.LogLevel = level.info;
    }

    var getLogLevel = function () {
        return global.LogLevel;
    };

    var setLogLevel = function (logLevel) {
        global.LogLevel = logLevel;
    };

    var getAppName = function () {
        if(!global.AppName) {
            return "";
        }
        return global.AppName;
    };

    var setAppName = function (appName) {
        global.AppName = appName;
    };

    var colorize = function (str, logLevel) {
        str = logLevel.color + str + colorReset;
        if (logLevel.bgColor) {
            str = logLevel.bgColor + str;
        }
        return str;
    };

    var formatMessage = function (args) {
        return pyformat(args[0], args[1], args[2]);
    };

    var formatLog = function (msg, logLevel) {
        return "[" + pid + "] " + colorize(logLevel.name, logLevel) + " " + getAppName()+":"+name + " - " + colorize(msg, logLevel);
    };

    var log = function (args, logLevel) {
        if (logLevel.value >= getLogLevel().value) {
            console.log(formatLog(formatMessage(args), logLevel));
        }
    };

    var error = function (args, logLevel) {
        if (logLevel.value >= getLogLevel().value) {
            console.error(formatLog(formatMessage(args), logLevel));
        }
    };

    return {
        getAppName : function() {
            getAppName();
        },
        setAppName : function(appName) {
            setAppName(appName)
        },
        getLogLevel: function () {
            getLogLevel();
        },
        setLogLevel: function (logLevel) {
            setLogLevel(logLevel);
        },
        logLevel: level,
        trace: function () {
            log(arguments, level.trace);
        },
        debug: function () {
            log(arguments, level.debug)
        },
        info: function () {
            log(arguments, level.info);
        },
        warn: function () {
            log(arguments, level.warn);
        },
        error: function () {
            error(arguments, level.error);
        }
    }

};

