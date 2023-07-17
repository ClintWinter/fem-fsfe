const express = require('express');
const server = require('http').createServer();
const app = express();
const PORT = 3000;

app.get('/', function (request, response) {
	response.sendFile('index.html', {root: __dirname});
});

server.on('request', app);
server.listen(PORT, () => { console.log(`Listening on port ${PORT}`); });
