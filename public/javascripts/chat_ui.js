(function (root) {
	var ChatClient = root.ChatClient = (root.ChatClient || {})

	var socket = io.connect("http://localhost:8080", { "sync disconnect on unload": true });
	var chat = new ChatClient.Chat(socket);

	$(document).ready( function () {
		$('#message-form').on("submit", function (event) {
			event.preventDefault();

			var messageText = $('#message').val();
			if(messageText.slice(0, 1) === "/") {
				chat.processCommand(messageText);
			} else {
				chat.sendMessage(messageText);
			}

			$('#message').val("");
		});
	})

	chat.on('message', function (data) {
		console.log(data)
		console.log(data.text);
		$li = $("<li>").text(data.nickname + ": " + data.text)
		$('ul.chat-content').append($li);
	});

	chat.on("roomListUpdate", function(data) {
		var $el = $(".client-list");
		$el.empty();
		data.nicknameList.forEach(function(user) {
			$el.append("<li>" + user + "</li>");
		})
	});

	chat.on("roomChange", function () {
		$('ul.chat-content').empty()
	})
})(this);