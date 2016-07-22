/*
 * Stars Theme:
 * For each loop, lights up x random pixels white with the rest remaining off.
 */
var Color = require('color');

function getRandomPixel(min, max) {
    return Math.ceil(Math.random() * (max-min) + min);
} 

module.exports = function(display) {
    return new Promise (function(resolve, reject){

        var numStars = 10;
        var numLoops = 200;
        var loopnum = 0;

        var loop = setInterval(function () {
            global.ledTheme = loop;
            display.setAllPixelsToColor(Color("black"));
            for(var i = 0; i < numStars; i++) {
                display.setPixelToColor(getRandomPixel(0, display.numPixels-1), Color("white"));
            }
            if (loopnum >= numLoops) {
                clearInterval(loop);
                global.ledTheme = null;
                resolve ();
            }
            loopnum ++;
        }, 1000/2);

    });
};