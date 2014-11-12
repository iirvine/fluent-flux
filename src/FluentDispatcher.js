var dispatched = require('./dispatched');
var QueuedDispatcher = require('./dispatched/QueuedDispatcher');
var FluentDispatchCycle = require('./FluentDispatchCycle');
var createActions = require('./lib/createActions');
var createStore = require('./lib/createStore');

var SomeOtherMixin = {
	willDispatch(action, params, dispatch) {
		console.log('second mixin');
		dispatch();
	}
}

var AnotherMixin = {
	willDispatch(action, params, dispatch) {
		console.log('third mixin');
		dispatch();
	}
}

var dispatcher = dispatched.createDispatcher({
	mixins: [QueuedDispatcher, SomeOtherMixin, AnotherMixin],

	register(store) {
		return this.registry.register({ctx: store, table: store.dispatchTable});
	},

	unregister(id) {
		this.registry.get(id).clear();
		return this.registry.unregister(id);
	},

	willDispatch(action, params, dispatch) {
		console.log('final: dispatcher');
		dispatch();
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

dispatcher.dispatch(function(){}, {init: true});

module.exports = dispatcher