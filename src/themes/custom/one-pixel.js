//
// Test the ability to turn on indiviual LED's
//

var Color = require('color');

function getRandomPixel(min, max) {
    return Math.random() * (max-min) + min; 
} 

module.exports = function(display) {
    return new Promise (function(resolve, reject){
        global.ledInterupt = false;
        var loopnum = 1;
        var loop = setInterval(function () {
           if (loopnum % 2 == 0){
                display.setAllPixelsToColor(Color("black"));
                display.setPixelToColor(getRandomPixel(0, 79), Color("red")); 
            }
            else {
                display.setAllPixelsToColor(Color("green"));
            }
            if (loopnum >= 500 || global.ledInterupt) {
                clearInterval(loop);
                resolve ();
            }
            loopnum ++;
        }, 1000/2);
    });
};