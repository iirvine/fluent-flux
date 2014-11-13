var BaseDispatcher = require('./BaseDispatcher');
var DefaultRegistry = require('./DefaultRegistry');
var mixSpecIntoConstructor = require('./lib/mixSpecIntoConstructor');
var { SpecRules, SpecPolicy } = require('./SpecPolicy');

module.exports = function defineDispatcher(spec) {
	class Dispatcher extends BaseDispatcher {
		constructor() {
			super(spec.registry || new DefaultRegistry());
			if (this.construct && typeof this.construct === 'function') {
				this.construct();
			}
		}
	}

	mixSpecIntoConstructor(
		spec, 
		Dispatcher,
		BaseDispatcher, 
		new SpecPolicy({
			startDispatch: SpecRules.OVERRIDE_BASE,
			register: SpecRules.OVERRIDE_BASE,
			unregister: SpecRules.OVERRIDE_BASE,
			willDispatch: SpecRules.CONTINUATION,
			mixins: SpecRules.DEFINE_MANY,
			construct: SpecRules.DEFINE_MANY
		}));

	return Dispatcher;
};