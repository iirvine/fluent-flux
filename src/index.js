var createAction = require('./lib/createAction');
var createDispatchRecord = require('./lib/createDispatchRecord');
var { changeHandler } = require('./lib/handlers');
var { anyPending } = require('./lib/storeHelpers');

var ALL_ACTIONS = createAction(function () {}, "ALL_ACTIONS");

var fluent = {
	Dispatcher: require('./FluentDispatcher'),
  ActionTypes: require('./ActionTypes'),
	handler: createDispatchRecord,
	changeHandler,
	anyPending,
	ALL_ACTIONS
};

module.exports = fluent;