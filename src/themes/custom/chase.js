//
// 
//

var Color = require('color');

module.exports = function(display) {
    return new Promise (function(resolve, reject){
        global.ledInterupt = false;
        var loopnum = 0;
        var loop = setInterval(function () {
            for (i=0; i<(global.pixelNum); i++) {
                display.setPixelToColor(i, Color("green"));
            }
            if (loopnum >= 2 || global.ledInterupt) {
                clearInterval(loop);
                resolve ();
            }
            loopnum ++;
        }, 1000/2);
    });
};

