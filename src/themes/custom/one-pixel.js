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
        console.log("led interupt value in one pixel", [global.ledInterupt]);
        var loopnum = 0;
        var loop = setInterval(function () {
            global.loop = loop;
            if (loopnum % 2 == 0){
                display.setAllPixelsToColor(Color("black"));
                display.setPixelToColor(getRandomPixel(0, global.pixelNum-1), Color("red")); 
            }
            else {
                display.setAllPixelsToColor(Color("green"));
            }
            if (loopnum >= 5 || global.ledInterupt) {
                console.log("Exiting one-pixel");
                clearInterval(loop);
                resolve ();
            }
            loopnum ++;
        }, 1000/2);
    });
};