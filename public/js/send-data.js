
var socket = null;

/**
 * initialises socket io connection
 */
window.onload = function () {
    console.log('onload');
    socket = io();
};

/**
 * sends color array via socket io connection
 */
function selectTheme(theme) {
    console.log('button pressed');
    socket.emit('selectTheme',theme);
}