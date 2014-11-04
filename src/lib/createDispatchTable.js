var invariant = require('./invariant');
var DispatchTable = require('../DispatchTable');

const TablePostfix = "_DispatchTable";

module.exports = function createDispatchTable(handlers, displayName) {
	if (!handlers || !handlers.length) {
		invariant(
			false,
			`createDispatchTable(...): Store ${store.displayName} has not declared any handlers.`
		);
	}

	var spec = {
		displayName: (displayName ? displayName : "") + TablePostfix
	}

	return new DispatchTable(handlers, spec);
}