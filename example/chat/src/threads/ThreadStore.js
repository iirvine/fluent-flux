var Dispatcher = require('../core/dispatcher');
var ChatMessageUtils = require('../utils/ChatMessageUtils');
var { changeHandler } = require('fluent-flux');
var { receiveAll } = require('../messages/MessageServerActions');

var currentID = null;
var dispatchToken = null;
var threads = {};

var ThreadStore = Dispatcher.createStore({
	displayName: "ThreadStore",
	
	init(rawMessages) {
		rawMessages.forEach((message) => {
			var threadID = message.threadID;
			var thread = threads[threadID];
			if (thread && thread.lastTimestamp > message.timestamp) {
				return;
			}
			threads[threadID] = {
				id: threadID,
				name: message.threadName,
				lastMessage: ChatMessageUtils.convertRawMessage(message, currentID)
			}
		});

		if (!currentID) {
			var allChrono = this.getAllChrono();
			currentID = allChrono[allChrono.length - 1].id;
		}

		threads[currentID].lastMessage.isRead = true;
	},

	getCurrentID() {
		return currentID;
	},

	getAll() {
		return threads;
	},

	getCurrent() {
		return this.get(this.getCurrentID());
	},

	getAllChrono() {
		var orderedThreads = [];
	  for (var id in threads) {
	    var thread = threads[id];
	    orderedThreads.push(thread);
	  }
	  orderedThreads.sort(function(a, b) {
	    if (a.lastMessage.date < b.lastMessage.date) {
	      return -1;
	    } else if (a.lastMessage.date > b.lastMessage.date) {
	      return 1;
	    }
	    return 0;
	  });
	  return orderedThreads;
	},

	getDispatchToken() {
		return dispatchToken
	},

	handlers: [
		changeHandler(receiveAll, (params) => {
			ThreadStore.init(params.rawMessages);
		})
	]
});

dispatchToken = Dispatcher.register(ThreadStore);

module.exports = ThreadStore;