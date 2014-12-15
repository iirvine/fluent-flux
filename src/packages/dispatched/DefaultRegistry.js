var invariant = require('./lib/invariant');

var lastId = -1;
var dispatchables = {};

class Registry {
	getAll() {
		return dispatchables;
	}
	
	get(id) {
		return dispatchables[id];
	}

	has(id) {
		return Boolean(dispatchables[id]);
	}

	register(dispatchable) {
		var id = `id${++lastId}`;
		dispatchables[id] = dispatchable;
		return id;
	}

	unregister(id) {
		invariant(
			this.has(id),
			`Registry.unregister(...): ${id} does not map to a registered dispatchable`
		);
		delete dispatchables[id];
	}
}

module.exports = Registry