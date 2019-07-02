const path = require('path');
const express = require('express');
const pug = require('pug');
const bodyParser = require('body-parser');
const moment = require('moment');
const crypto = require('crypto');
const base64url = require('base64-url');

const pjson = require('./package.json');
var program = require('commander');

const app = express();

var options = {
	port: 3000,
	host: '127.0.0.1',
	url: 'https://notica.us',
	title: 'Notification from Notica',
	icon: 'img/icon.png',
};

program.version(pjson.version)
	.option('-p, --port <port>', 'Host port (3000)', '3000')
	.option('-H, --host <IP>', 'Host IP (127.0.0.1)', '127.0.0.1')
	.option('-U, --url <URL>', 'Website URL (https://notica.us)', 'https://notica.us')
	.option('-t, --title <string>', 'Custom title (\'Notification from Notica\')', 'Notification from Notica')
	.option('-i, --icon <path>', 'Custom icon (img/icon.png)', 'img/icon.png');

program.on('--help', function() {
	console.log('');
	console.log('  Example:');
	console.log('');
	console.log('    $ npm start -- -p 80 -t \'My cool Title\'');
	console.log('');
});

program.parse(process.argv);

Object.keys(options).forEach(function(key) {
	options[key] = program[key] || options[key];
});

const host = options.host;
const port = options.port;
const url = options.url;
const title = options.title;
const icon = options.icon;

if (port == 80 || port == 443) {
	console.log('WARNING: For security, you should run Notica behind a reverse proxy. See README.');
}

app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'pug')

function log(message) {
	console.log(moment().format() + ': ' + message);
}

function generateID() {
	const bytes = crypto.randomBytes(30);
	const string = base64url.encode(bytes);
	return string.substring(0, 6);
}

app.use('/', express.static(path.join(__dirname, 'public')));
app.get('/*', (req, res) => {
	res.render('index', { secureID: generateID(), title: title, icon: icon })
});

app.post('*', (req, res) => {
	let id = req.path.substring(1, 20); // maintain backwards compat.
	id = id || Object.keys(req.query)[0] || '';
	let data = Object.keys(req.body)[0];

	if (data && data.substring(0,2) === 'd:') {
		if (io.sockets.adapter.rooms[id]) {
			let message = data.substring(2);

			log('[NOTICA] Message sent to ' + id + ': ' + message);

			io.in(id).emit('message', message);

			res.end();
		} else {
			log('No one in room to send data to: ' + id);
			res.status(404).send('No devices have that Notica ID open. Please open this URL: '
				+ url + '/?' + id + '\n');
		}
	} else {
		log('WTF')
		log('Ignoring bad POST data to: ' + id);
		res.status(400).send('Bad POST data. Expecting prefix of "d:".\n');
	}
});

const server = app.listen(port, host, (err) => {
	if (err) {
		log('[ERROR] Server error: ' + err);
		return;
	}
	console.info('==> Listening on port %s. Open up http://%s:%s/ in your browser.', port, host, port);
});

const io = require('socket.io').listen(server);

io.on('connection', (socket) => {
	var address = socket.handshake.address;
	log('New connection from ' + address);
	socket.on('room', (room) => {
		log('New connection joining room: ' + room);
		socket.join(room);
	});
});
