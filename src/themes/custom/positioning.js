//
// Experimental theme for mapping
//

var Color = require('color');

module.exports = function(display) {
    return new Promise (function(resolve, reject){
        global.ledInterupt = false;;
        
        var green = function (pixelNumber) {
            var timerOne = setTimeout(function () {
                display.setPixelToColor(pixelNumber, Color("green"));
            }, 5000);
        };
        
        var black = function (pixelNumber) {
            var timerOne = setTimeout(function () {
                display.setPixelToColor(pixelNumber, Color("black"));
            }, 5000);
        };
        
        green(0);
        for(i=0; i<(global.pixelNum-1); i++) {
            green(i+1);
            black(i);
        }
        resolve();
    });
};

