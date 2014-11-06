var createDispatchRecord = require('./createDispatchRecord');

function after(handler, fn) {
	return function() {
		handler.apply(this, arguments);
		fn.apply(this, arguments);
	}
}

function before(handler, fn) {
	return function() {
		fn.apply(this, arguments);
		handler.apply(this, arguments);
	}
}

function emitsChange(handler) {
	return after(handler, function() {
		this.emitChange();
	});
}

function fromDispatchRecord(make) {
	return function(fn) {
		return function(record) {
			return make.apply(make, record.concat(fn));
		}
	}
}

function beforeHandler(action, handler, fn) {
	return createDispatchRecord(action, before(handler, fn));
}

beforeHandler.fromDispatchRecord = fromDispatchRecord(beforeHandler);

function changeHandler(action, handler) {
	if (!handler) {
			handler = () => {};
	}
	
	return createDispatchRecord(action, emitsChange(handler));
}

module.exports = {
	changeHandler,
	beforeHandler
}