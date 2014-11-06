var fluent = require('fluent-flux');
var Dispatcher = require('../common/dispatcher');
var ThreadStore = require('../threads/ThreadStore');
var ChatMessageUtils = require('../utils/ChatMessageUtils');
var { createMessage } = require('./MessageActions');
var { receiveAll } = require('./MessageServerActions');
var { handler } = fluent;

var dispatchToken = null;
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
	},

	getDispatchToken() {
		return dispatchToken;
	},

	handlers: [
		handler(createMessage, (params) => {
			var message = MessageStore.getCreatedMessageData(params.text);
			messages[message.id] = message;
		}),

		handler(receiveAll, (params) => {
			addMessages(params.rawMessages);
			Dispatcher.waitFor(ThreadStore.getDispatchToken());
			markAllInThreadRead(ThreadStore.getCurrentID());
		})
	]
});

dispatchToken = Dispatcher.register(MessageStore);

module.exports = MessageStore;