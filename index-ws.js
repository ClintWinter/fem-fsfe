const express = require('express');
const server = require('http').createServer();
const app = express();
const PORT = 3000;

app.get('/', function (request, response) {
	response.sendFile('index.html', {root: __dirname});
});

server.on('request', app);
server.listen(PORT, () => { console.log(`Listening on port ${PORT}`); });

process.on('SIGINT', () => {
	wss.clients.forEach((client) => {
		client.close();
	});

	server.close(() => {
		shutdownDB();
	});
});

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

	db.run(`insert into visitors (count, time) values (${numClients}, datetime('now'))`);

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

 /** Database **/

const sqlite  = require('sqlite3');
const db = new sqlite.Database(':memory:');

db.serialize(() => {
	db.run(`create table visitors (count INTEGER, time TEXT)`);
});

function getCounts() {
	db.each('select * from visitors', (err, row)  => {
		console.log({row});
	});
}

function shutdownDB() {
	getCounts();
	console.log('Shutting down...');
	db.close();
}
