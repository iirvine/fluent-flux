var createAction = require('./lib/createAction');
var createDispatchRecord = require('./lib/createDispatchRecord');
var { beforeHandler, changeHandler } = require('./lib/handlers');
var { anyPending } = require('./lib/storeHelpers');

var ALL_ACTIONS = createAction(function () {}, "ALL_ACTIONS");

var fluent = {
	Dispatcher: require('./Dispatcher'),
	handler: createDispatchRecord,
	changeHandler,
	beforeHandler,
	anyPending,
	ALL_ACTIONS
};

module.exports = fluent;