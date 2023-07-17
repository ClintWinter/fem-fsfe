const express = require('express');
const server = require('http').createServer();
const app = express();
const PORT = 3000;

app.get('/', function (request, response) {
	response.sendFile('index.html', {root: __dirname});
});

server.on('request', app);
server.listen(PORT, () => { console.log(`Listening on port ${PORT}`); });

/** WEBSOCKETS **/

const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
	const numClients = wss.clients.size;
	console.log(`Clients connected: ${numClients}`);

	wss.broadcast(`Current visitors: ${numClients}`);

	if (ws.readyState === ws.OPEN) {
		ws.send('Welcome to my server');
	}

	ws.on('close', function close() {
		console.log('The client as disconnected.');
		wss.broadcast(`Current visitors: ${numClients}`);
	});
});

wss.broadcast = function (input) {
	wss.clients.forEach(function (client) {
		if (client.readyState !== client.OPEN) {
			return;
		}

		client.send(input);
	});
};
