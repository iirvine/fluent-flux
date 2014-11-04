var BaseStore = require('../Store');
var assign = require('object-assign');

module.exports = function createStore(spec) {
	class Store extends BaseStore {

	}

	assign(Store.prototype, spec);
	return new Store();
}