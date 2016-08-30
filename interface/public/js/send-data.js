var socket = null;

/**
 * initialises socket io connection
 */
window.onload = function () {
    console.log('onload');
    socket = io();
    var tweetNum = 0;

    socket.on('tweet', function(tweet){
        tweetNum ++;
//        console.log('total tweet number', tweetNum);
//        console.log('tweet received', tweet);
        if(document.getElementById("tweetDisplay") !== null){
            var div = document.getElementById('tweetDisplay');
            div.innerHTML = tweetToHtml(tweet) + div.innerHTML;
        }
    });
    socket.on('mediaTheme', function(theme) {
        if (theme.type === 'video') {
            console.debug("video playing {}", [theme.fileName]);
            sampleVideoCanvas(theme.fileName);
        }
        if (theme.type === 'gif') {
            console.debug("gif displaying {}", [theme.fileName]);
            sampleGifCanvas(theme.fileName);
        }
        if (theme.type === 'image') {
            console.debug("image displaying {}", [theme.fileName]);
            sampleImageCanvas(theme.fileName);
        }
    });
    socket.on('interupt', function() {
        clearVideo();
        clearGif();
    });
    socket.emit('historicTweets');
};

/**
 * sends color array via socket io connection
 */
function selectTheme(theme) {
    console.log('button pressed');
    clearVideo();
    socket.emit('selectTheme',theme);
}

function tweetToHtml(tweet) {
    var html = '<div class="tweet">';
    html = html + '<img src="'+ tweet.user.profile_image_url +'">';
    html = html + '<span><span class="userName">' + tweet.user.name + '</span>' + '<span class="screenName">' + '@' + tweet.user.screen_name + '</span>' + '<span class="timeStamp">' + tweet.created_at.substring(0,16) + '</span></span>';
    html = html + '<p>' + tweet.text + '</p>';
    html = html + '</div>';
    return html;
}

function colorSliderChanged() {
    var red = document.getElementById('redChannel').value;
    var green = document.getElementById('greenChannel').value;
    var blue = document.getElementById('blueChannel').value;
    red = red >> 4;
    green = green >> 4;
    blue = blue >> 4;
    var colorString = ("#" + red.toString(16) + green.toString(16) + blue.toString(16));
    socket.emit('selectColor', colorString);
    console.log("combined color", ["#" + red.toString(16) + green.toString(16) + blue.toString(16)]);
}

function clearVideo() {
  if (video) {
    video.pause();
  }
}

function clearGif() {
  if(gifLoop) {
      clearInterval(gifLoop);
      gifLoop = null;
  }
}

function buttonDisable() {
    document.getElementById('slider1').style.pointerEvents = 'none';
    document.getElementById('slider2').style.pointerEvents = 'none';
    document.getElementById('slider3').style.pointerEvents = 'none';
    document.getElementById('javanButton').style.pointerEvents = 'none';
    document.getElementById('sunriseButton').style.pointerEvents = 'none';
    document.getElementById('rainButton').style.pointerEvents = 'none';
    document.getElementById('flagButton').style.pointerEvents = 'none';
    timeOut = setTimeout(buttonTimeOut, 5000);
}

function buttonTimeOut() {
  document.getElementById('slider1').style.pointerEvents = 'auto';
  document.getElementById('slider2').style.pointerEvents = 'auto';
  document.getElementById('slider3').style.pointerEvents = 'auto';
  document.getElementById('javanButton').style.pointerEvents = 'auto';
  document.getElementById('sunriseButton').style.pointerEvents = 'auto';
  document.getElementById('rainButton').style.pointerEvents = 'auto';
  document.getElementById('flagButton').style.pointerEvents = 'auto';
}
