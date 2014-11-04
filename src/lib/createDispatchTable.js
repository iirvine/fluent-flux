var DispatchTable = require('../DispatchTable');
var merge = require('react/lib/merge');

module.exports = function createDispatchTable(store) {
	

	return new DispatchTable(store.handlers);
}