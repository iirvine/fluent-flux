var BaseStore = require('../Store');
var assign = require('object-assign');
var invariant = require('./invariant');

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

	assign(Store.prototype, spec);
	return new Store();
}