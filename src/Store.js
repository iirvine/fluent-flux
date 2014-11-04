var { EventEmitter } = require('events');
var keyMirror = require('react/lib/keyMirror');

var { setPending, resolve } = require('./lib/storeHelpers');

const CHANGE_EVENT = "change";

class BaseStore extends EventEmitter {
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