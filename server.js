const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const host = 'http://127.0.0.1';
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', express.static(path.join(__dirname, 'public')));
app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('*', (req, res) => {
	let id = req.path.substring(1);
	let data = Object.keys(req.body)[0];

	if (data && data.substring(0,2) === 'd:') {
		let message = data.substring(2);

		console.log("to: " + id);
		console.log(message);

		io.in(id).emit('message', message);

		res.end();
	}
});

const server = app.listen(port, 'localhost', (err) => {
	if (err) {
		console.log(err);
		return;
	}
	console.info('==> Listening on port %s. Open up %s:%s/ in your browser.', port, host, port);
});

const io = require('socket.io').listen(server);

io.on('connection', (socket) => {
	console.log("new connection!");
	socket.on('room', (room) => {
		console.log("telling it to join room.");
		socket.join(room);
	});


});
