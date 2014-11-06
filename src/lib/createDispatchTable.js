var invariant = require('./invariant');
var DispatchTable = require('../DispatchTable');

const TablePostfix = "_DispatchTable";

module.exports = function createDispatchTable(handlers, displayName) {
	var spec = {
		displayName: (displayName ? displayName : "") + TablePostfix
	}

	return new DispatchTable(handlers, spec);
}