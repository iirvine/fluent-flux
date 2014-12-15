var Dispatcher = require('../core/dispatcher');
var ChatMessageUtils = require('../utils/ChatMessageUtils');
var ThreadStore = require('./ThreadStore');
var MessageStore = require('../messages/MessageStore');
var { changeHandler } = require('fluent-flux');
var { clickThread } = require('./ThreadActions');
var { receiveAll } = require('../messages/MessageServerActions');

var dispatchToken = null;

var UnreadThreadStore = Dispatcher.createStore({
	displayName: "UnreadThreadStore",

	getDispatchToken() {
		return dispatchToken;
	},

	getCount() {
		var threads = ThreadStore.getAll();
		var unreadCount = 0;
		for (var id in threads) {
			if (!threads[id].lastMessage.isRead) {
				unreadCount++;
			}
		}
		return unreadCount;
	},

	beforeHandler() {
		Dispatcher.waitFor(
			ThreadStore.getDispatchToken(), 
			MessageStore.getDispatchToken()
		);
	},
	
	handlers: [
		changeHandler(clickThread),
		changeHandler(receiveAll, () => {
			Dispatcher.dispatch(clickThread);
		})
	]
});

dispatchToken = Dispatcher.register(UnreadThreadStore);

module.exports = UnreadThreadStore;