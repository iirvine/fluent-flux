var BaseStore = require('../Store');
var assign = require('object-assign');
var invariant = require('./invariant');
var createDispatchRecord = require('./createDispatchRecord');

function before(handler, fn) {
	return function() {
		fn.apply(this, arguments);
		handler.apply(this, arguments);
	}
}

module.exports = function createStore(spec) {
	class Store extends BaseStore {

	}

	invariant(
		spec.getDispatchToken,
		`Stores must implement getDispatchToken() method.`
	);

	invariant(
		spec.handlers,
		`Store ${spec.displayName} has not declared any handlers.`
	);

	if (spec.beforeHandler) {
		spec.handlers = spec.handlers.map((record) => {
			var [action, handler] = record;
			return createDispatchRecord(action, before(handler, spec.beforeHandler))
		})
	}

	assign(Store.prototype, spec);
	return new Store();
}