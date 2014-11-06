var createAction = require('./lib/createAction');
var createDispatchRecord = require('./lib/createDispatchRecord');
var { anyPending } = require('./lib/storeHelpers');

function after(handler, fn) {
	return function() {
		handler.apply(this, arguments);
		fn.apply(this, arguments);
	}
}

function emitsChange(handler) {
	return after(handler, function() {
		this.emitChange();
	});
}

var fluent = {
	Dispatcher: require('./Dispatcher'),
	handler: createDispatchRecord,
	changeHandler: (action, handler) => {
		return createDispatchRecord(action, emitsChange(handler));
	},
	anyPending: anyPending,
	ALL_ACTIONS: createAction(function () {}, "ALL_ACTIONS")
};

module.exports = fluent;