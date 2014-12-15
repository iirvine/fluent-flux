var createAction = require('./lib/createAction');
var createDispatchRecord = require('./lib/createDispatchRecord');
var { changeHandler } = require('./lib/handlers');
var { anyPending } = require('./lib/storeHelpers');

var fluent = {
	Dispatcher: require('./FluentDispatcher'),
  createApp: require('./lib/createApp'),
	handler: createDispatchRecord,
	changeHandler,
	anyPending
};

module.exports = fluent;