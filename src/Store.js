var { EventEmitter } = require('events');
var invariant = require('./lib/invariant');
var { setPending, resolve } = require('./lib/storeHelpers');
var createDispatchTable = require('./lib/createDispatchTable');

const CHANGE_EVENT = "change";

class BaseStore extends EventEmitter {
	constructor() {
		if (!this.displayName) {
			this.displayName = "Store";
		}
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

	handlers(...handlers) {
		if (!arguments.length) {
			invariant(
				this.dispatchTable,
				`${this.displayName}.handlers(): No handlers have been declared.`
			);
			return this.dispatchTable;
		}

		this.dispatchTable = createDispatchTable(handlers, this.displayName);
	}
}

module.exports = BaseStore