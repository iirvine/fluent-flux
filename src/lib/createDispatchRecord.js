var invariant = require('react/lib/invariant');

module.exports = function createDispatchRecord(action, handler) {
	if (!action) {
		invariant(action, 
			"You have tried to create a dispatch record with a null or undefined Action type - this is usually an error.")
	}

	return [action, handler];
}