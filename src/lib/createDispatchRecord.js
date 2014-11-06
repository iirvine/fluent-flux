var invariant = require('./invariant');

function after(handler, fn) {
	return function() {
		handler.apply(this, arguments);
		fn.apply(this, arguments);
	}
}

function emitsChange(handler) {
	return after(handler, function() {
		this.emitChange();
	});
}

module.exports = function createDispatchRecord(action, handler) {
	invariant(
		action, 
		"handler(...): You have tried to create a dispatch handler with a null or undefined Action type - this is usually an error."
	);

	return [action, emitsChange(handler)];
}