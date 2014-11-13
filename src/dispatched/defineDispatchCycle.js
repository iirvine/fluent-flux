var BaseDispatchCycle = require('./BaseDispatchCycle');
var DefaultRegistry = require('./DefaultRegistry');
var mixSpecIntoConstructor = require('./lib/mixSpecIntoConstructor');
var { SpecRules, SpecPolicy } = require('./SpecPolicy');

module.exports = function defineDispatchCycle(spec) {
	class DispatchCycle extends BaseDispatchCycle {
		constructor() {
			super();
			if (this.construct && typeof this.construct == 'function')
				this.construct();
		}
	}

	mixSpecIntoConstructor(
		spec, 
		DispatchCycle, 
		BaseDispatchCycle, 
		new SpecPolicy({
			dispatchTo: SpecRules.OVERRIDE_BASE,
			willDispatchTo: SpecRules.DEFINE_MANY,
		}));

	return DispatchCycle;
};