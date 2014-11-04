var invariant = require('./invariant');

module.exports = function createDispatchRecord(action, handler) {
	invariant(
		action, 
		"handler(...): You have tried to create a dispatch handler with a null or undefined Action type - this is usually an error."
	);

	return [action, handler];
}