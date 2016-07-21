from flask import Flask
from flask import request
import time
from neopixel import *

app = Flask(__name__)

# LED strip configuration:
LED_COUNT      = 1002       # Number of LED pixels.
LED_PIN        = 18         # GPIO pin connected to the pixels (must support PWM!).
LED_FREQ_HZ    = 800000     # LED signal frequency in hertz (usually 800khz)
LED_DMA        = 5          # DMA channel to use for generating signal (try 5)
LED_BRIGHTNESS = 30         # Set to 0 for darkest and 255 for brightest
LED_INVERT     = False      # True to invert the signal (when using NPN transistor level shift)

# Create NeoPixel object with appropriate configuration.
strip = Adafruit_NeoPixel(LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT, LED_BRIGHTNESS)
# Intialize the library (must be called once before other functions).
strip.begin()

def setPanel(strip, data):
    for p in range(len(data)/3):
        r = int(data[p*3],16)*16
        g = int(data[p*3+1],16)*16
        b = int(data[p*3+2],16)*16
        strip.setPixelColor(p,Color(g,r,b))
    strip.show()

@app.route('/', methods=['POST', 'GET'])
def hello_world():
    if request.method == 'POST':
        setPanel(strip, request.form['data'])
        return request.form['data']
    else:
        return 'Hello, World! [GET]'