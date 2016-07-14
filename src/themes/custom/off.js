var Color = require('color');

module.exports = function(display) {
    return new Promise (function(resolve, reject){
        display.setAllPixelsToColor(Color("black"));
        resolve();
    });
};