var Dispatcher = require('../core/Dispatcher');
var ChatMessageUtils = require('../utils/ChatMessageUtils');
var ThreadStore = require('./ThreadStore');
var MessageStore = require('../messages/MessageStore');
var ThreadActionTypes = require('./ActionTypes');
var MessageActionTypes = require('../messages/ActionTypes')
var { changeHandler } = require('fluent-flux');

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
		changeHandler(ThreadActionTypes.CLICK_THREAD),
		changeHandler(MessageActionTypes.server.RECEIVE_ALL, () => {
			Dispatcher.dispatch(ThreadActionTypes.CLICK_THREAD);
		})
	]
});

dispatchToken = Dispatcher.register(UnreadThreadStore);

module.exports = UnreadThreadStore;