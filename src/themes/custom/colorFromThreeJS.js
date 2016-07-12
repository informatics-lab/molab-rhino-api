//
// Displays colour of 3D rhino onto real rhino
//

var Color = require('color');

module.exports = function(display, colorString) {
    return new Promise (function(resolve, reject){
        global.ledInterupt = false;
        var loopnum = 0;
        var loop = setInterval(function () {

            display.setAllPixelsToColor(Color(colorString));

            if (loopnum >= 10 || global.ledInterupt) {
                clearInterval(loop);
                resolve ();
            }
            loopnum ++;
        }, 1000/2);
    });
};