var fluent = require('fluent-flux');
var Dispatcher = require('../common/dispatcher');
var ChatMessageUtils = require('../utils/ChatMessageUtils');
var { handler } = fluent;
var { receiveAll } = require('../messages/MessageServerActions');

var currentID = null;
var threads = {};

var ThreadStore = fluent.createStore({
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
	}
});

ThreadStore.handlers(
	handler(receiveAll, (params) => {
		ThreadStore.init(params.rawMessages);
		ThreadStore.emitChange();
	})
);

ThreadStore.dispatchToken = Dispatcher.register(ThreadStore.handlers());

module.exports = ThreadStore;