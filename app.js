const http = require('http');

const hostname = "localhost";
const port = 8080;

const server = http.createServer((req, res) => {
	res.statusCode = 200;
})

server.listen(port, hostname, () => {
	console.log(`Server running at : http://${hostname}:${port}`);
})