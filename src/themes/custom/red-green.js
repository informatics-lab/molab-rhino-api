//
// Flash green/red quickly enough to see yellow 
//

var Color = require('color');

module.exports = function(display) {
    return new Promise (function(resolve, reject){
        var loopnum = 0;
        var loop = setInterval(function () {
            global.ledTheme = loop;
            if (loopnum % 2 == 0){
                display.setAllPixelsToColor(Color("red")); 
            }
            else {
                display.setAllPixelsToColor(Color("green"));
            }
            if (loopnum >= 500) {
                clearInterval(loop);
                global.ledTheme = null;
                resolve ();
            }
            loopnum ++;
        }, 1000/20);
    });
}