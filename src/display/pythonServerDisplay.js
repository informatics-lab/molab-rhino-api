var logger = require('../log/index').logger;
var log = new logger("displays.pythonServerDisplay");

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const DATA_QUERY_STRING_KEY = "data";

module.exports = function (baseUrl, numPixels) {

    var convertColorTo12bit = function (color) {
        log.trace("Original color is [{}]",[color.hexString()]);
        var r = color.red() >> 4;
        var g = color.green() >> 4;
        var b = color.blue() >> 4;
        log.trace("12 bit color is [#{}{}{}]",[r.toString(16),g.toString(16),b.toString(16)]);
        return ""+r.toString(16)+""+g.toString(16)+""+b.toString(16);
    };

    var write = function (colors) {
        log.trace("Writing colors to python server [{}]", [baseUrl]);
        var xhr = new XMLHttpRequest();
        var url = baseUrl + "?" + DATA_QUERY_STRING_KEY + "=" + colors.join("");
        log.trace("Getting url [{}]",[url]);
        xhr.open("GET", url);
        xhr.send();
    };

    var writeAsPost = function (colors) {
        log.trace("Writing colors to python server [{}]", [baseUrl]);
        var xhr = new XMLHttpRequest();
        log.trace("Posting data to url [{}]",[url]);
        xhr.open("POST", url);
        xhr.send(colors.join(""));
    };

    return {

        setPixelsToColorArray: function (colorArray) {
            if (colorArray.length > numPixels) {
                throw "pixelColorArray may not contain more elements than " + numPixels;
            }
            var colors = [];
            colorArray.forEach(function (color) {
                colors.push(convertColorTo12bit(color));
            });
            write(colors);
        },

        setPixelToColor: function (pixelNum, color) {
            log.debug("Setting pixel {} to color [{}]",[pixelNum, color.hexString()]);
            if (pixelNum > numPixels - 1 || pixelNum < 0) {
                throw "pixelNum must be between 0 and " + numPixels - 1;
            }
            var colors = [];
            for(var i = 0; i < pixelNum - 1; i ++ ) {
                colors.push('000');
            }
            colors.push(convertColorTo12bit(color));
            write(colors);
        },

        setAllPixelsToColor: function (color) {
            log.debug("Setting all ({}) pixels to color [{}]",[numPixels, color.hexString()]);
            var simpleColor = convertColorTo12bit(color);
            var colors = [];
            for(var i = 0; i < numPixels; i++){
                colors.push(simpleColor);
            }
            write(colors);
        }
    }
};