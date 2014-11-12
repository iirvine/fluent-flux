var invariant = require('./lib/invariant');
var warning = require('./lib/warning');

var QueuedDispatcher = {
	construct() {
		this.queue = [];
	},
	
	willDispatch(action, params, dispatch) {
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
		dispatch();
	},
	
	queueDispatch(action, params) {
		if (!this.isDispatching()) {
			this.dispatch(action, params)
		}
		this.queue.push({action, params})
	},
	
	flushQueue() {
		var queued;
		while(queued = this.queue.pop())
			this.dispatch(queued.action, queued.params);
	},
	
	endDispatch() {
		this.flushQueue();
	},
}

module.exports = QueuedDispatcher;