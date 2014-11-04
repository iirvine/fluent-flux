var createAction = require('./lib/createAction');
var { anyPending } = require('./lib/storeHelpers');

var fluent = {
	Dispatcher: require('./Dispatcher'),
	createStore: require('./lib/createStore'),
	handler: require('./lib/createDispatchRecord'),
	anyPending: anyPending,
	ALL_ACTIONS: createAction(function () {}, "ALL_ACTIONS")
};

module.exports = fluent;