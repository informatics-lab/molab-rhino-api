//
// Flash green/red quickly enough to see yellow 
//

var Color = require('color');

module.exports = function(display) {
    return new Promise (function(resolve, reject){
        var loopnum = 1;
        var loop = setInterval(function () {
            if (loopnum % 2 == 0){
                display.setAllPixelsToColor(Color("red")); 
            }
            else {
                display.setAllPixelsToColor(Color("green"));
            }
            if (loopnum == 500) {
                clearInterval(loop);
                resolve ();
            }
            loopnum ++;
        }, 1000/20);
    });
}