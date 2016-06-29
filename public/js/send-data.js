
var socket = null;

/**
 * initialises socket io connection
 */
window.onload = function () {
    console.log('onload');
    socket = io();
    
    socket.on('tweet', function(tweet){
        console.log('tweet received', tweet);
        var div = document.getElementById('tweetDisplay');
        div.innerHTML = tweetToHtml(tweet) + div.innerHTML;
        
    });
    
};

/**
 * sends color array via socket io connection
 */
function selectTheme(theme) {
    console.log('button pressed');
    socket.emit('selectTheme',theme);
}

function tweetToHtml(tweet) {
    var html = '<div class="tweet">';
    html = html + '<img src="'+tweet.user.profile_image_url+'" />';
    html = html + '<span><span class="userName">' + tweet.user.name + '</span>' + '<span class="screenName">' + '@' + tweet.user.screen_name + '</span></span>';
    html = html + '<p>' + tweet.text + '</p>';
    html = html + '</div>';
    return html;
}
