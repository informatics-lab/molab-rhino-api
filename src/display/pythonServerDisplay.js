var logger = require('../log/index').logger;
var log = new logger("displays.pythonServerDisplay");

var request = require('request');

module.exports = function (baseUrl, numPixels) {

    var convertColorTo12bit = function (color) {
        log.trace("Original color is [{}]",[color.hexString()]);
        var r = color.red() >> 4;
        var g = color.green() >> 4;
        var b = color.blue() >> 4;
        log.trace("12 bit color is [#{}{}{}]",[r.toString(16),g.toString(16),b.toString(16)]);
        return ""+r.toString(16)+""+g.toString(16)+""+b.toString(16);
    };

    var writeAsPost = function (colors) {
        log.trace("Posting colors to python server at [{}]", [baseUrl]);
        var params = {
            url : baseUrl,
            formData : {
                data : colors.join("")
            }
        };
        request.post(params);
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
            writeAsPost(colors);
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
            writeAsPost(colors);
        },

        setAllPixelsToColor: function (color) {
            log.debug("Setting all ({}) pixels to color [{}]",[numPixels, color.hexString()]);
            var simpleColor = convertColorTo12bit(color);
            var colors = [];
            for(var i = 0; i < numPixels; i++){
                colors.push(simpleColor);
            }
            writeAsPost(colors);
        }
    }
};