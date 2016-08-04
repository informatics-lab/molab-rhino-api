# molab-rhino-api  
Allows a web interface to control the operation of an LED array connected to a Raspberry Pi (or Arduino).

## The Met Office Informatics Lab Rhino Project
The three main parts are separated into three directories:
* `interface` - directory that contains the main application and web pages.
* `python-server` - directory that contains the server to pass information to the LEDs.
* `deploy` - directory that contains an application for automatic git hub deployment.

This project makes use of web sockets, threejs, and the twitter API.

To make full use of the twitter functionality the raspberry pi or local computer needs to have an internet connection. If no internet connection see **Important!** below.

## Configuration

### Interface
Contains the front and back end.
##### Front end - `public`
Contains the main web page and associated styling and javascript.
**Note** - made specifically for an iPad.
`send-data.js` communicates with the back end.
`led-mapping.js` maps an image or video onto the LED array. See [led-mapper](https://github.com/met-office-lab/led-mapper) for mapping details.
##### Back end - `src`
`app.js` is the main node application.
Change the following to match your project:
* `var display = new Display("urlOfPyhtonServer", LED-count);` - set urlOfPyhtonServer to match the python server; LED-count to the number of LEDs.
* `const KEYWORD` - the keyword used to search twitter
* swap between display options depending on the use of arduino or raspberry pi.

### Python Server
Contains a bash script `ledserver.sh` to run the python server `ledserver.py`.

Adjust `LED_COUNT` in the python server to match the number of LEDs used.

In the bash script `export FLASK_APP=pathToCall` adjust pathToCall to set were the bash script can be successfully called from.

### Deploy
Contains a node application which will run a list of commands upon receiving a git webhook.

Edit the commands executed in `function deploy()` to match your project.

Edit these variables to match your project:
* `port`
* `projectRoot`
* `subdomain`

### Important!
This project requires access to twitter.

For the project to work successfully the following environment variables need to be set:
* `TWITTER_CONSUMER_KEY`
* `TWITTER_CONSUMER_SECRET`
* `TWITTER_ACCESS_TOKEN_KEY`
* `TWITTER_TOKEN_SECRET`

If these can not be set please remove lines `44-71` in `app.js`. This will remove all twitter functionality.

## Building and running
Once downloaded run `npm install` in the `deploy` and `interface` directories.

Start the python server and main node application by running `npm start` in the `interface` directory.

Whilst these are still running start the node application for deployment by running `npm start` in the `deploy` directory.

This now lets the master branch on the raspberry pi update when there are any changes to the master branch on GitHub.

#### Forever
The deployment node application runs using the forever npm package.

#### Alternative build
The python server and node server can be run different machines, make sure to edit the `urlOfPyhtonServer` accordingly.

Use `node bin/www` to start the node server and `sudo ./ledserver.sh` to start the python server.

## Adding themes
When adding themes create a new `themeName.js` file in the `custom` directory, changing `themeName`. 

Then index this new theme by adding it into the `index.js` file in the `custom` directory.

Finally add this new theme to `themeServer.js`.

Themes can then be linked to the front end by adding an onclick event into the .html file referencing the themeName.
