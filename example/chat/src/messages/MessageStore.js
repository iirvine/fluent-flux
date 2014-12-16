var Dispatcher = require('../core/Dispatcher');
var ThreadStore = require('../threads/ThreadStore');
var ChatMessageUtils = require('../utils/ChatMessageUtils');
var ActionTypes = require('./ActionTypes');
var { changeHandler } = require('fluent-flux');

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

var MessageStore = Dispatcher.createStore({
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
		changeHandler(ActionTypes.CREATE_MESSAGE, (params) => {
			var message = MessageStore.getCreatedMessageData(params.text);
			messages[message.id] = message;
		}),

		changeHandler(ActionTypes.server.RECEIVE_ALL, (params) => {
			addMessages(params.rawMessages);
			Dispatcher.waitFor(ThreadStore.getDispatchToken());
			markAllInThreadRead(ThreadStore.getCurrentID());
		})
	]
});

dispatchToken = Dispatcher.register(MessageStore);

module.exports = MessageStore;