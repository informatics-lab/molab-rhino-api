//
// Test the ability to turn on indiviual LED's
//

var Color = require('color');

module.exports = function(display) {
    return new Promise (function(resolve, reject){
        global.ledInterupt = false;
        var loopnum = 0;
        var loop = setInterval(function () {

            display.setAllPixelsToColor(Color("black"));

            if (loopnum >= 2 || global.ledInterupt) {
                clearInterval(loop);
                resolve ();
            }
            loopnum ++;
        }, 1000/2);
    });
};