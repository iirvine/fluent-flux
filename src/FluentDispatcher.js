var dispatched = require('./dispatched');
var QueuedDispatcher = require('./dispatched/QueuedDispatcher');
var FluentDispatchCycle = require('./FluentDispatchCycle');
var createActions = require('./lib/createActions');
var createStore = require('./lib/createStore');

var dispatcher = dispatched.createDispatcher({
	mixins: [QueuedDispatcher],

	register(store) {
		return this.registry.register({ctx: store, table: store.dispatchTable});
	},

	unregister(id) {
		this.registry.get(id).clear();
		return this.registry.unregister(id);
	},

	startDispatch(action, params, start) {
		start(new FluentDispatchCycle());
	},

	createActions(spec) {
		return createActions(spec, this);
	},

	createStore(spec) {
		return createStore(spec);
	}
});

module.exports = dispatcher