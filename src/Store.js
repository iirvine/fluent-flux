var warn = require('./lib/warning');
var invariant = require('./lib/invariant');
var createDispatchTable = require('./lib/createDispatchTable');
var { EventEmitter } = require('events');
var { setPending, resolve } = require('./lib/storeHelpers');

const CHANGE_EVENT = "change";

class BaseStore extends EventEmitter {
	constructor() {
		if (!this.displayName) {
			this.displayName = "Store";
		}

		this.dispatchTable = createDispatchTable(this.handlers, this.displayName);
		delete this.handlers;
	}

	emitChange() {
		this.emit(CHANGE_EVENT);
	}

	addChangeListener(cb) {
		this.on(CHANGE_EVENT, cb);
	}

	removeChangeListener(cb) {
		this.removeListener(CHANGE_EVENT, cb)
	}

	setPending() {
		setPending(this);
	}

	resolve() {
		resolve(this);
	}
}

module.exports = BaseStore