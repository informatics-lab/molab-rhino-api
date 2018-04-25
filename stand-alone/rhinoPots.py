#!/usr/bin/env python3
# NeoPixel library strandtest example
# Author: Tony DiCola (tony@tonydicola.com)
#
# Direct port of the Arduino NeoPixel library strandtest example.  Showcases
# various animations on a strip of NeoPixels.

import time
from neopixel import *
import argparse
from envirophat import analog


# LED strip configuration:
LED_COUNT      = 1000      # Number of LED pixels.
LED_PIN        = 18      # GPIO pin connected to the pixels (18 uses PWM!).
LED_FREQ_HZ    = 800000  # LED signal frequency in hertz (usually 800khz)
LED_DMA        = 10      # DMA channel to use for generating signal (try 10)
LED_BRIGHTNESS = 30     # Set to 0 for darkest and 255 for brightest
LED_INVERT     = False   # True to invert the signal (when using NPN transistor level shift)
LED_CHANNEL    = 0       # set to '1' for GPIOs 13, 19, 41, 45 or 53

global redShade 
global greenShade 
global blueShade
redShade = 0
greenShade = 0
blueShade = 0

# Define functions which animate LEDs in various ways.

def colorWipePot():
	"""Wipe color across display a pixel at a time.
	color defined by analog read
	"""
	
	for i in range(strip.numPixels()):
		greenShade = int(analog.read(0) * 55)
		blueShade = int(analog.read(1) * 55)
		redShade = int(analog.read(2) * 55)
		strip.setPixelColor(i, Color(greenShade, blueShade ,redShade))
		strip.show()
			
def colorWipeExit():
	"""Wipe color across display a pixel at a time."""
	for i in range(strip.numPixels()):
		strip.setPixelColor(i, Color(0,0,0))
		#print i
	strip.show()

# Main program logic follows:
if __name__ == '__main__':
	# Process arguments
	parser = argparse.ArgumentParser()
	parser.add_argument('-c', '--clear', action='store_true', help='clear the display on exit')
	args = parser.parse_args()

	# Create NeoPixel object with appropriate configuration.
	strip = Adafruit_NeoPixel(LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT, LED_BRIGHTNESS, LED_CHANNEL)
	# Intialize the library (must be called once before other functions).
	strip.begin()

	print ('Press Ctrl-C to quit.')
	if not args.clear:
		print('Use "-c" argument to clear LEDs on exit')

	try:
		
		while True:
			colorWipePot() 
			

	except KeyboardInterrupt:
		if args.clear:
			colorWipeExit()
			
