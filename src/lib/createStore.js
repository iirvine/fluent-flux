var BaseStore = require('../Store');
var assign = require('object-assign');
var invariant = require('./invariant');
var { beforeHandler } = require('./handlers');

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
		spec.handlers = spec.handlers.map(
			beforeHandler.fromDispatchRecord(spec.beforeHandler)
		);
	}

	assign(Store.prototype, spec);
	return new Store();
}