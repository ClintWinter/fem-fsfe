const http = require('http');
const PORT = 3000;

http.createServer(function (req, res) {
	res.write('hello from fsfe');
	res.end();
}).listen(3000);
