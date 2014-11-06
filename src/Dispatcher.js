var Map = require('es6-map');
var invariant = require('./lib/invariant');
var warning = require('./lib/warning');

var Dispatch = require('./Dispatch');
var createActions = require('./lib/createActions');
var createStore = require('./lib/createStore');

var lastId = 1;
var IS_DISPATCHING = false
var dispatchTables = {};

class Dispatcher {
	constructor() {
		this.queue = [];
	}
	
	register(store) {
		var id = `id${++lastId}`
		dispatchTables[id] = {
			ctx: store,
			table: store.dispatchTable
		}
		delete store.dispatchTable;
		return id;
	}

	unregister(id) {
		invariant(dispatchTables[id],
			`Dispatcher.unregister(...): ${id} does not map to a registered dispatch table.`);
		
		dispatchTables[id].clear();
		delete dispatchTables[id];
	}

	isDispatching() {
		return IS_DISPATCHING;
	}

	createActions(spec) {
		return createActions(spec, this);
	}

	createStore(spec) {
		return createStore(spec);
	}

	waitFor(...ids) {
		invariant(
			IS_DISPATCHING || !this.currentDispatch,
			'Dispatcher.waitFor(...): Cannot call waitFor while not currently dispatching.'
		);

		ids.forEach((id) => {
			if (this.currentDispatch.isPending[id]) {
				invariant(
					this.currentDispatch.isPending[id],
					`Dispatcher.waitFor(...): Circular dependency detected while waiting for ${id}`
				);
				return;
			}
			invariant(
				dispatchTables[id],
				`Dispatcher.waitFor(...): ${id} does not map to a registered dispatch table.`
			);
			this.currentDispatch.dispatchToTable(id, dispatchTables[id]);
		});
	}

	dispatch(action, params) {
		if (this.isDispatching()) {
			warning(
				!this.isDispatching(),
				'Dispatcher.dispatch(...): Cascading dispatch detected. \n' +
				`You have tried to dispatch an action of type '${action.displayName()}' while simultaneously dispatching an action of type '${this.currentDispatch.payload.action.displayName()}'. ` +
				'This action will be queued until the pending payload has finished dispatching. ' +
				'Actions should avoid cascading updates wherever possible.'
			);

			return this.queueDispatch(action, params);
		}

		this.startDispatch(action, params, (currentDispatch) => {
			IS_DISPATCHING = true;
			this.currentDispatch = currentDispatch;
			try {
				for (var id in dispatchTables) {
					currentDispatch.dispatchToTable(id, dispatchTables[id])
				}

			} finally {
				IS_DISPATCHING = false;
				this.currentDispatch = null;
				this.flushQueue();
			}
		});
	}

	queueDispatch(action, params) {
		if (!this.isDispatching()) {
			this.dispatch(action, params)
		}
		this.queue.push({action, params})
	}

	flushQueue() {
		var queued;
		while(queued = this.queue.pop())
			this.dispatch(queued.action, queued.params);
	}

	startDispatch(action, params, cb) {
		cb(new Dispatch({action, params}));
	}
}

module.exports = Dispatcher