var DefaultDispatchCycle = require('./DefaultDispatchCycle');
var DefaultRegistry = require('./DefaultRegistry');
var mixSpecIntoConstructor = require('./lib/mixSpecIntoConstructor');
var assign = require('object-assign');
var { SpecRules, SpecPolicy } = require('./SpecPolicy');

module.exports = function createDispatchCycle(spec) {
	var Constructor = function() {
		DefaultDispatchCycle.call(this);
		if (this.construct && typeof this.construct == 'function')
			this.construct();
	};

	Constructor.prototype.constructor = Constructor;

	mixSpecIntoConstructor(
		spec, 
		Constructor, 
		DefaultDispatchCycle, 
		new SpecPolicy({
			dispatchTo: SpecRules.OVERRIDE_BASE,
			willDispatchTo: SpecRules.DEFINE_MANY,
		}));
	
	assign(Constructor.prototype, DefaultDispatchCycle.prototype);

	return new Constructor();
}