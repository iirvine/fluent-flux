var BaseDispatcher = require('./BaseDispatcher');
var DefaultRegistry = require('./DefaultRegistry');
var mixSpecIntoConstructor = require('./lib/mixSpecIntoConstructor');
var { SpecRules, SpecPolicy } = require('./SpecPolicy');

module.exports = function createDispatcher(spec) {
	var Constructor = function() {
		if (this.construct && typeof this.construct == 'function')
			this.construct();
	};

	Constructor.prototype = new BaseDispatcher(spec.registry || new DefaultRegistry);
	Constructor.prototype.constructor = Constructor;

	mixSpecIntoConstructor(
		spec, 
		Constructor,
		BaseDispatcher, 
		new SpecPolicy({
			startDispatch: SpecRules.OVERRIDE_BASE,
			register: SpecRules.OVERRIDE_BASE,
			unregister: SpecRules.OVERRIDE_BASE,
			willDispatch: SpecRules.CONTINUATION,
			mixins: SpecRules.DEFINE_MANY,
			construct: SpecRules.DEFINE_MANY
		}));

	return new Constructor();
}