var http = require('http');
var router = require("./router");
var chatServer = require("./lib/chat_server");

var server = http.createServer(function(req, res) {
	// res.writeHead(200, {
// 		"Content-Type": "text/plain"
// 	});
// 	res.end("Hello World\n");
	router.route(req, res);
}).listen(8080);

console.log("Server running at http://localhost:8080");

chatServer.listen(server);

console.log("Websockets server running");