var Dispatcher = require('../core/dispatcher');
var ActionTypes = require('./ActionTypes');

var MessageServerActions = Dispatcher.createActions({
	receiveAll(rawMessages) {
		this.dispatch(
      ActionTypes.server.RECEIVE_ALL(), 
      {rawMessages}
    );
	},

	receiveCreatedMessage(createdMessage) {
		this.dispatch(
      ActionTypes.server.RECEIVE_CREATED_MESSAGE(), 
      {createdMessage}
    );
	}
});

module.exports = MessageServerActions;