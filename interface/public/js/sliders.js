/* Code by Steven Estrella. http://www.shearspiremedia.com */
/* we need to change slider appearance oninput and onchange */
function showValue(val,slidernum,vertical) {
	/* setup variables for the elements of our slider */
	var thumb = document.getElementById("sliderthumb" + slidernum);
	var shell = document.getElementById("slidershell" + slidernum);
	var track = document.getElementById("slidertrack" + slidernum);
	var fill = document.getElementById("sliderfill" + slidernum);
	var rangevalue = document.getElementById("slidervalue" + slidernum);
	var slider = document.getElementById("slider" + slidernum);

	var pc = val/(slider.max - slider.min); /* the percentage slider value */
	var thumbsize = 40; /* must match the thumb size in your css */
	var bigval = 250; /* widest or tallest value depending on orientation */
	var smallval = 42; /* narrowest or shortest value depending on orientation */
	var tracksize = bigval - thumbsize;
	var fillsize = 40;
	var filloffset = 0;
	var bordersize = 0;
	var loc = vertical ? (1 - pc) * tracksize : pc * tracksize;
	rangevalue.innerHTML = val;

	thumb.style.top =  (vertical ? loc : 0) + "px";
	thumb.style.left = (vertical ? 0 : loc) + "px";
	fill.style.top = (vertical ? loc + (thumbsize/2) : filloffset + bordersize) + "px";
	fill.style.left = (vertical ? filloffset + bordersize : 0) + "px";
	fill.style.width = (vertical ? fillsize : loc + (thumbsize/2)) + "px";
	fill.style.height = (vertical ? bigval - filloffset - fillsize - loc : fillsize) + "px";
	shell.style.height = (vertical ? bigval : smallval) + "px";
	shell.style.width = (vertical ? smallval : bigval) + "px";
	track.style.height = (vertical ? bigval  : fillsize) + "px"; /* adjust for border */
	track.style.width = (vertical ? fillsize : bigval ) + "px"; /* adjust for border */
	track.style.left = (vertical ? filloffset + bordersize : 0) + "px";
	track.style.top = (vertical ? 0 : filloffset + bordersize) + "px";
}

/* we often need a function to set the slider values on page load */
function setValue(val,num,vertical) {
	document.getElementById("slider"+num).value = val;
	showValue(val,num,vertical);
}

document.addEventListener('DOMContentLoaded', function(){
  setValue(128,1,false);
  setValue(128,2,false);
  setValue(128,3,false);
});

function themeButtonPressed() {
	setValue(128,1,false);
	setValue(128,2,false);
	setValue(128,3,false);
}

function colorOutputFromSlider() {
    var red = document.getElementById('slider1').value;
    var green = document.getElementById('slider2').value;
    var blue = document.getElementById('slider3').value;
    red = red >> 4;
    green = green >> 4;
    blue = blue >> 4;
    var colorString = ("#" + red.toString(16) + green.toString(16) + blue.toString(16));
    socket.emit('selectColor', colorString);
    console.log("combined color", ["#" + red.toString(16) + green.toString(16) + blue.toString(16)]);
}
