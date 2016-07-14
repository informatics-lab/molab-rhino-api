var logger = require('../log/index').logger;
var log = new logger("displays.arduinoDisplay");

var five = require("johnny-five");
var pixel = require("node-pixel");
// var SerialPort = require("serialport");


const NUM_PIXELS = 60;
const DATA_PIN = 6;
const PORT = '/dev/cu.usbmodem1411';

module.exports = function () {

    // var port = new SerialPort(PORT, {
    //     baudRate: 115200
    // });

    var board = new five.Board({
        port: PORT
    });

    var strip = null;
    board.on("ready", function () {

        log.info("Board ready, lets add light");

        strip = new pixel.Strip({
            pin: DATA_PIN,         // # pin pixels connected to
            length: NUM_PIXELS,     // number of pixels in the strip
            board: this,
            controller: "FIRMATA"
        });

        strip.on("ready", function () {
            log.debug("Strip ready, let's go");
            strip.pixel(0).color('red');
            strip.pixel(1).color('yellow');
            strip.pixel(2).color('green');
            strip.show();
        });
    });

    return {

        setPixelsToColorArray: function (colorArray) {
            if (colorArray.length > NUM_PIXELS) {
                throw "pixelColorArray may not contain more elements than " + NUM_PIXELS;
            }
            if (strip) {
                var index = 0;
                colorArray.forEach(function (color) {
                    strip.pixel(index).color(color.hexString());
                    index++;
                });
                strip.show();
            }
        },

        setPixelToColor: function (pixelNum, color) {
            log.debug("Setting pixel {} to color [{}]",[pixelNum, color.hexString()]);
            if (pixelNum > NUM_PIXELS - 1 || pixelNum < 0) {
                throw "pixelNum must be between 0 and " + NUM_PIXELS - 1;
            }
            if(strip) {
                strip.pixel(pixelNum).color(color.hexString());
                strip.show();
            }
        },

        setAllPixelsToColor: function (color) {
            log.debug("Setting all ({}) pixels to color [{}]",[NUM_PIXELS, color.hexString()]);
            if(strip) {
                strip.color(color.hexString());
                strip.show();
            }
        }
    }
};