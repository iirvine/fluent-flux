var Dispatcher = require('../core/dispatcher');
var API = require('../core/API');
var MessageStore = require('./MessageStore');
var ActionTypes = require('./ActionTypes');

var MessageActions = Dispatcher.createActions({
  createMessage(text) {
		var message = MessageStore.getCreatedMessageData(text);
		
		this.dispatch(ActionTypes.CREATE_MESSAGE(), {text});
		API.createMessage(message);
	}
});

module.exports = MessageActions;