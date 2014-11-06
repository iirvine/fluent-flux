var Dispatcher = require('../common/dispatcher');
var API = require('../common/API');

var MessageActions = Dispatcher.createActions({
	
	createMessage(text) {
		var MessageStore = require('./MessageStore');  //watch for circular imports!
		var message = MessageStore.getCreatedMessageData(text);
		
		this.dispatch({text});
		API.createMessage(message);
	},
	
});

module.exports = MessageActions;