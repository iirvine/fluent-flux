var Dispatcher = require('../common/dispatcher');

var MessageServerActions = Dispatcher.createActions({
	
	receiveAll(rawMessages) {
		this.dispatch({rawMessages});
	},

	receiveCreatedMessage(createdMessage) {
		this.dispatch({createdMessage});
	}
	
});

module.exports = MessageServerActions;