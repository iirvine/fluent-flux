var invariant = require('./invariant');
var { SpecRules, SpecPolicy } = require('../SpecPolicy');

function chain(first, second) {
	return function() {
		first.apply(this, arguments);
		second.apply(this, arguments); 
	};
}

/*
Creates a "continuation" chained function from function args first and second - 
eg, a chain of functions that each call the next function in the chain.
Continuation functions are expected to follow the NodeJS callback interface, eg:
		function myFunction(...someArgs, next) { }
*/
function makeContinuation(first, second) {
	return function(...args) {
		var self = this;
		var params = args.slice(0, args.length - 1);

		first.apply(this, params.concat(function() {
			second.apply(self, params.concat(args[args.length - 1]));
		}));
	}
}

function validateMethodOverride(proto, name, policy, Type) {
	var specPolicy = policy.get(name);

	if (Type.prototype.hasOwnProperty(name)) {
		invariant(
			specPolicy === SpecRules.OVERRIDE_BASE,
			`You are attempting to override ${name} from your class specification. ` + 
			'Ensure that your method names do not overlap with base class methods.'
		);
	}

	if (proto.hasOwnProperty(name)) {
		invariant(
			specPolicy === SpecRules.DEFINE_MANY || specPolicy === SpecRules.CONTINUATION,
			`You are attempting to define ${name} from your class specification more than once. ` + 
			'This conflict may be due to a mixin.'
		);
	}
}

module.exports = function mixSpecIntoConstructor(spec, Constructor, Type, policy) {
	var proto = Constructor.prototype;

	if (spec.hasOwnProperty('mixins')) {
		spec.mixins.forEach((mixin) => mixSpecIntoConstructor(mixin, Constructor, Type, policy));
	}

	for (var name in spec) {
		if (!spec.hasOwnProperty(name)) {
			continue;
		}

		if (name === 'mixins') {
			continue;
		}

		var property = spec[name];
		validateMethodOverride(proto, name, policy, Type);

		var isAlreadyDefined = proto.hasOwnProperty(name);
		if (isAlreadyDefined) {
			var specPolicy = policy.get(name);
			if (specPolicy === SpecRules.DEFINE_MANY) {
				proto[name] = chain(proto[name], property);
			}

			if (specPolicy === SpecRules.CONTINUATION) {
				proto[name] = makeContinuation(proto[name], property);
			}
		} else {
			proto[name] = property;
		}
	}
}