var fluent = require('fluent-flux');
var Dispatcher = require('../common/dispatcher');
var ThreadStore = require('../threads/ThreadStore');
var ChatMessageUtils = require('../utils/ChatMessageUtils');
var { createMessage } = require('./MessageActions');
var { receiveAll } = require('./MessageServerActions');
var { handler } = fluent;

var messages = {};

function addMessages(rawMessages) {
	rawMessages.forEach((message) => {
		if (!messages[message.id]) {
			messages[message.id] = ChatMessageUtils.convertRawMessage(
				message,
				ThreadStore.getCurrentID()
			);
		}
	});
}

function markAllInThreadRead(threadID) {
	for (var id in messages) {
		if (messages[id].threadID === threadID) {
			messages[id].isRead = true;
		}
	}
}

var MessageStore = fluent.createStore({
	displayName: 'MessageStore',

	get(id) {
		return messages[id];
	},

	getAll() {
		return messages;
	},

	getAllForThread(threadID) {
		throw new Error("Not implemented");
	},

	getAllForCurrentThread() {
		return this.getAllForThread(ThreadStore.getCurrentID());
	},

	getCreatedMessageData(text) {
		var timestamp = Date.now();

		return {
			id: 'm_' + timestamp,
			threadID: ThreadStore.getCurrentID(),
			authorName: 'Ian',
			date: new Date(timestamp),
			text: text,
			isRead: true
		};
	}
});

MessageStore.handlers(
	handler(createMessage, (params) => {
		var message = MessageStore.getCreatedMessageData(params.text);
		messages[message.id] = message;
		MessageStore.emitChange();
	}),

	handler(receiveAll, (params) => {
		addMessages(params.rawMessages);
		Dispatcher.waitFor(ThreadStore.dispatchToken);
		markAllInThreadRead(ThreadStore.getCurrentID());
		MessageStore.emitChange()
	})
);

MessageStore.dispatchToken = Dispatcher.register(MessageStore.handlers());

module.exports = MessageStore;