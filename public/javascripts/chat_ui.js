(function (root) {
	var ChatClient = root.ChatClient = (root.ChatClient || {})

	var socket = io.connect("http://localhost:8080");
	var chat = new ChatClient.Chat(socket);

	$(document).ready( function () {
		$('#message-form').on("submit", function (event) {
			event.preventDefault();
			var messageText = $('#message').val();
			chat.sendMessage(messageText);
		});
	})

	chat.on('message', function (data) {
		console.log(data)
		console.log(data.text);
		$li = $("<li>").text(data.text)
		$('ul.chat-content').append($li);
	});

})(this);