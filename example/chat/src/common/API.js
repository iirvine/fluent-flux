var { receiveCreatedMessage, receiveAll } = require('../messages/MessageServerActions');

var API = {
	getAllMessages() {
		var rawMessages = JSON.parse(localStorage.getItem('messages'));

		receiveAll(rawMessages);
	},

	createMessage(message, threadName) {
		var rawMessages = JSON.parse(localStorage.getItem('messages'));
		var timestamp = Date.now();
		var id = 'm_' + timestamp;
		var threadID = message.threadID || ('t_' + Date.now());
		var createdMessage = {
			id,
			threadID,
			threadName,
			timestamp,
			authorName: message.authorName,
			text: message.text
		};

		rawMessages.push(createdMessage);
		localStorage.setItem('messages', JSON.stringify(rawMessages));

		setTimeout(receiveCreatedMessage, 500);
	}
}

module.exports = API;