var Dispatcher = require('./dispatcher');
var { createActions } = require('fluent-flux');

var CommonActions = Dispatcher.createActions({
	REQUEST_DISPATCHED() {
		this.dispatch();
	},
});

module.exports = CommonActions