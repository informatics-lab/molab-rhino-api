var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var execSync = require('child_process').execSync;
var localtunnel = require('localtunnel');

var port = 5000;
var projectRoot = '~/github/molab-rhino-api/';

var tunnel = localtunnel(port, { subdomain: 'rhino' }, function (err, tunnel) {
    if (err) console.log('error: ' + err);
    else app.listen(port, function () {
		console.log(`listening on port ${port}`);
        console.log(`deploy service ready at ${tunnel.url}`);
	});
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//navigating to root should give user info about this hook
app.get('/', function (req, res) {
	res.send(`deploy service ready at ${tunnel.url}`);
	res.end();
});

//navigating to /deploy should initiate the deployment
app.get('/deploy', function (req, res) {
    deploy();
	res.send('deployment triggered');
	res.end();
});

//this is the primary route used by a GitHub hook
app.post('/deploy', function (req, res) {
	console.log(req.body.pusher.name + ' just pushed to ' + req.body.repository.name);
	console.log('deploying...');
	deploy();
	res.sendStatus(200);
	res.end();
});

function deploy() {
  // change to home directory
  console.log('move to home directory...');
	execSync('cd ~/github/molab-rhino-api/', execCallback);

  // kill the npm start
  console.log('kill npm start...');
	execSync('ps aux | grep \'sh -c node\' | grep -v grep | awk \'{print $2}\' | xargs sudo kill -9', execCallback);

  // kill existing flask server
  console.log('kill flask server...');
  execSync('ps aux | grep flask | grep -v grep | awk \'{print $2}\' | xargs sudo kill -9', execCallback);

  // kill node server
  console.log('kill node server...');
  execSync('ps aux | grep bin/www | grep -v grep | awk \'{print $2}\' | xargs sudo kill -9', execCallback);

	// reset any changes that have been made locally
	console.log('resetting git...');
	execSync(`git -C ${projectRoot} reset --hard`, execCallback);

	// and ditch any files that have been added locally too
	console.log('cleaning git...');
	execSync(`git -C ${projectRoot} clean -df`, execCallback);

	// now pull down the latest
	console.log('pulling git...');
	execSync(`git -C ${projectRoot} pull -f origin master`, execCallback);

	// and npm install interface with --production
	console.log('npm installing...');
	execSync(`npm -C ~/github/molab-rhino-api/interface install --production`, execCallback);

  // and npm install deploy with --production
	console.log('npm installing...');
	execSync(`npm -C ~/github/molab-rhino-api/deploy install --production`, execCallback);

  // change to interface directory
  console.log('move to interface directory...');
	execSync('cd ~/github/molab-rhino-api/interface', execCallback);

  // and run npm start
  console.log('restarting servers...');
  execSync('npm start', execCallback);

}

function execCallback(err, stdout, stderr) {
	if (stdout) console.log(stdout);
	if (stderr) console.log(stderr);
}
