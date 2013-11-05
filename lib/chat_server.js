var guestNumber = 0;
var nicknames = {};
var namesUsed = {};
var currentRooms = {}

module.exports.listen = function(httpServer) {
	var socketio = require("socket.io");
	var io = socketio.listen(httpServer);

	io.sockets.on("connection", function(socket) {
		initialConnection(io, socket);

		socket.on("disconnect", function() {
			var oldName = nicknames[socket.id];
			delete nicknames[socket.id];

			io.sockets.emit("roomList", getRoomData(io));

			io.sockets.in(currentRooms[socket.id]).emit("message", {
				nickname: "server",
				text: oldName + " has left the room"
			})
		})

		socket.on("message", function(data) {
			var message = {
				nickname: nicknames[socket.id],
				text: data.text
			}
			io.sockets.in(currentRooms[socket.id]).emit("message", message)
			console.log("Server recieved message: " + data.text)
		});

		socket.on("changeRoomRequest", function (room) {
			joinRoom(io, socket, room)
			socket.emit("changeRoom")
		})

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

				io.sockets.emit("roomList", getRoomData(io));

				io.sockets.in(currentRooms[socket.id]).emit("message", {
					nickname: "server",
					text: oldName + " has changed nicknames to " + data
				});
			}
		})
	});
}

var initialConnection = function(io, socket) {
	nicknames[socket.id] = "guest_" + guestNumber++;
	joinRoom(io, socket, "lobby")

	socket.emit("nicknameChangeResult", {
		success: true,
		name: nicknames[socket.id]
	});

	io.sockets.emit("roomList", getRoomData(io));
}

var joinRoom = function (io, socket, room) {
	if (currentRooms[socket.id]) {
		leaveRoom(io, socket);
	}

	currentRooms[socket.id] = room
	socket.join(room)
	io.sockets.in(currentRooms[socket.id]).emit("message", {
		nickname: "server",
		text: nicknames[socket.id] + " has joined the room '" + currentRooms[socket.id] + "'."
	});

	io.sockets.emit("roomList", getRoomData(io));
}

var leaveRoom = function (io, socket) {
	io.sockets.in(currentRooms[socket.id]).emit("message", {
		nickname: "server",
		text: nicknames[socket.id] + " has left the room '" + currentRooms[socket.id] + "'."
	})
	socket.leave(currentRooms[socket.id]);
}

var getRoomData = function(io) {
	var roomData = {};

	for(var room in io.sockets.manager.rooms) {
		if (room === "") continue;

		var userArr = io.sockets.manager.rooms[room].map(function(socketId) {
			return nicknames[socketId];
		});
		roomData[room] = userArr;
	}

	return roomData;
}