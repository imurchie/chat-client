var guestNumber = 0;
var nicknames = {};
var namesUsed = {};

module.exports.listen = function(httpServer) {
	var socketio = require("socket.io");
	var io = socketio.listen(httpServer);

	io.sockets.on("connection", function(socket) {
		initialConnection(io, socket);

		socket.on("disconnect", function() {
			var oldName = nicknames[socket.id];
			delete nicknames[socket.id];
			io.sockets.emit("roomListUpdate", {
				nicknameList: getNicknames()
			});

			io.sockets.emit("message", {
				nickname: "server",
				text: oldName + " has left the room"
			})
		})

		socket.on("message", function(data) {
			var message = {
				nickname: nicknames[socket.id],
				text: data.text
			}
			io.sockets.emit("message", message)
			console.log("Server recieved message: " + data.text)
		});

		socket.on("nicknameChangeRequest", function(data) {
			if(namesUsed.hasOwnProperty(data)) {
				// can't change
				socket.emit("nicknameChangeResult", {
					success: false,
					message: "Name already taken"
				});
			} else if(data.length === 0) {
				socket.emit("nicknameChangeResult", {
					success: false,
					message: "Name cannot be empty"
				});
			} else {
				// change
				namesUsed[data] = "";
				var oldName = nicknames[socket.id];
				nicknames[socket.id] = data;
				socket.emit("nicknameChangeResult", {
					success: true,
					message: data
				});

				io.sockets.emit("roomListUpdate", {
					nicknameList: getNicknames()
				});

				io.sockets.emit("message", {
					nickname: "server",
					text: oldName + " has changed nicknames to " + data
				});
			}
		})
	});
}

var initialConnection = function(io, socket) {
	nicknames[socket.id] = "guest_" + guestNumber++;

	socket.emit("nicknameChangeResult", {
		success: true,
		name: nicknames[socket.id]
	});

	io.sockets.emit("roomListUpdate", {
		nicknameList: getNicknames()
	});

	io.sockets.emit("message", {
		nickname: "server",
		text: nicknames[socket.id] + " has entered the room"
	})
}

var getNicknames = function() {
	var names = [];
	for(var key in nicknames) {
		names.push(nicknames[key]);
	}

	return names;
}