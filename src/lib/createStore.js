var BaseStore = require('../Store');

module.exports = function createStore(spec) {
	class Store extends BaseStore {

	}

	assign(Store.prototype, spec);
	return new Store();
}