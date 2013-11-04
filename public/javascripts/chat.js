(function (root) {
	var ChatClient = root.ChatClient = (root.ChatClient || {});

	var Chat = ChatClient.Chat = function (socket) {
		this.socket = socket;

		var that = this;
		this.socket.on("nicknameChangeResult", function(data) {
			if(data.success) {
				that.nickname = data.name;
			} else {
				console.log("failed nickname change")
			}
		});
	}

	Chat.prototype.sendMessage = function (msg) {
		if(msg.slice(0, 1) === "/") {
			this.processCommand(msg);
		} else {
			var message = {
				text: msg
			}
			this.socket.emit('message', message)
		}
	}

	Chat.prototype.on = function(eventName, callback) {
		this.socket.on(eventName, callback)
	}

	Chat.prototype.processCommand = function(msg) {
		if(msg.slice(0, 5) === "/nick") {
			this.socket.emit("nicknameChangeRequest", msg.slice(6));
		}
	}

})(this);