var createAction = require('./lib/createAction');
var createDispatchRecord = require('./lib/createDispatchRecord');
var {changeHandler} = require('./lib/handlers');
var {anyPending} = require('./lib/storeHelpers');
var {createApp} = require('fluent-app');

var fluent = {
	Dispatcher: require('./FluentDispatcher'),
	handler: createDispatchRecord,
  createApp,
	changeHandler,
	anyPending
};

module.exports = fluent;