var createAction = require('./lib/createAction');
var { anyPending } = require('./lib/storeHelpers');

var fluent = {
	Dispatcher: require('./Dispatcher'),
	createActions: require('./lib/createActions'),
	createStore: require('./lib/createStore'),
	handler: require('./lib/createDispatchRecord'),
	createDispatchTable: require('./lib/createDispatchTable'), 
	ALL_ACTIONS: createAction(function () {}, "ALL_ACTIONS"),
	anyPending: anyPending,
};

module.exports = fluent;