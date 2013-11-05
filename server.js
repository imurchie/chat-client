var http = require('http');
var router = require("./router").router;
var chatServer = require("./lib/chat_server");

var server = http.createServer(router).listen(8080);

console.log("Server running at http://localhost:8080");

chatServer.listen(server);

console.log("Websockets server running");