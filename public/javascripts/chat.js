(function (root) {
	var ChatClient = root.ChatClient = (root.ChatClient || {});

	var Chat = ChatClient.Chat = function (socket) {
		this.socket = socket;
	}

	Chat.prototype.sendMessage = function (msg) {
		this.socket.emit('message', msg)
	}

	Chat.prototype.on = function(eventName, callback) {
		this.socket.on(eventName, callback)
	}

})(this);