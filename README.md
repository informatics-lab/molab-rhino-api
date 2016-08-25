# molab-rhino-api  
Allows a web interface in addition to twitter to control the operation of an LED array connected to a Raspberry Pi (or Arduino). This makes use of websockets and the twitter API.

## The Met Office Informatics Lab Rhino Project
The main parts are separated into three directories:
* `interface` - directory that contains the main application and web pages.
* `python-server` - directory that contains the server to pass information to the LEDs.
* `deploy` - directory that contains an application for automatic git hub deployment.

To make full use of the twitter functionality the raspberry pi or local computer needs to have an internet connection. If no internet connection see **Important!** below.

## Configuration

### Interface
Contains the front and back end.

`app.js` is the main node application, change the following to match your project:
```
var display = new Display("urlOfPyhtonServer", LED-count);
```
   - set urlOfPyhtonServer to match the python server.
   * LED-count to the number of LEDs.
   - Swap between display options depending on the use of arduino or raspberry pi.

`const KEYWORD` - the keyword used to search twitter.

**Note:** the Client facing website is made specifically for iPad.

### Python Server
Contains a bash script `ledserver.sh` to run the python server `ledserver.py`.

Adjust `LED_COUNT` in the python server to match the number of LEDs used.

In the bash script `export FLASK_APP=pathToCall` adjust pathToCall to set were the bash script can be successfully called from.

Requires python and the [Neopixel library](https://github.com/adafruit/Adafruit_NeoPixel) to control the connected LEDs.

### Deploy
Contains a node application which will run a list of commands upon receiving a [git webhook](https://help.github.com/articles/about-webhooks/).

Edit the commands executed in `function deploy()` to match your project.

Edit these variables used by [localtunnel](https://localtunnel.github.io/www/) to match your project:
* `port`
* `projectRoot`
* `subdomain`

### Important!
This project requires access to twitter.

For the project to work successfully the following environment variables need to be set:

```
TWITTER_CONSUMER_KEY
TWITTER_CONSUMER_SECRET
TWITTER_ACCESS_TOKEN_KEY
TWITTER_TOKEN_SECRET
```

If these cannot be set or no internet connection is present, please remove lines `44-74` in `app.js`. This will remove the twitter functionality.

## Building and running

Install NeoPixels onto your Raspberry Pi, this allows you to control the LED array. Follow the link to get up an running

[https://learn.adafruit.com/neopixels-on-raspberry-pi/overview](https://learn.adafruit.com/neopixels-on-raspberry-pi/overview)

Once that is installed clone the repo

```
git clone https://github.com/met-office-lab/molab-rhino-api.git
```

Once downloaded run `[sudo] npm install` in the `deploy` and `interface` directories.

Start the python server and node application by running `npm start` in the `interface` directory.

Whilst these are still running start the node application for deployment by running `npm start` in the `deploy` directory.

Deploy works using localtunnel which needs installed globally - `sudo npm install -g localtunnel`.

This now lets the master branch on the raspberry pi update when there are any changes to the master branch on GitHub (still a bit buggy).

### Mapping
To map an LED array to display images and video see [led-mapper](https://github.com/met-office-lab/led-mapper) for more details.

Once completed an array of the LED location should be produced. Set `const LED_MAPPING` in `led-mapping.js` to this array.

#### Forever
The deployment node application runs using the forever npm package. This needs installed globally `sudo npm install forever -g`. Forever monitor also need to be installed `sudo npm install -g  forever-monitor`.

#### Alternative build
The python server and node server can be run different machines, make sure to edit the `urlOfPyhtonServer` accordingly.

Use `node bin/www` to start the node server and `sudo ./ledserver.sh` to start the python server.

## Adding themes
There are two methods to adding themes, they can either be 1. media based themes or 2. programmed themes.

#### 1. Media themes
These are either photos, videos or gifs, add the desired files to `interface/public/data`

These files then need index in `interface/src/themes/data/theme-index.json` using the following format:

```
{"name":"star", "fileName":"starry.js", "type":"programmed"}
```

  - name - the keyword used to activate the theme
  - fileName - the name of the video or photo, include the file extension.
  - type - either set to video, image, gif, or programmed based on the the theme type.

**Note** video based themes will **not** auto play on a mobile device due to OS restrictions. This is bypassed by using gif files for mobile OS.  

Media themes can be slow to load onto the LED array if the file size is very large (>15mb). Due to the low resolution of the array compressing files is not an issue. 

#### 2. Programmed themes
When adding themes create a new `themeName.js` file in the `custom` directory, changing `themeName`.

Then index this new theme by adding it into the `index.js` file in the `custom` directory.

Finally add this new theme to `themeServer.js`.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

[GNU General Public License (GPL) v3](https://www.gnu.org/licenses/gpl-3.0.en.html)
