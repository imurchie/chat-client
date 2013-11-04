module.exports.listen = function(httpServer) {
	var socketio = require("socket.io");
	var io = socketio.listen(httpServer);

	io.sockets.on("connection", function(socket) {
		socket.on("message", function(data) {
			io.sockets.emit("message", {text: data})
			console.log("Server recieved message: " + data)
		});
	});
}