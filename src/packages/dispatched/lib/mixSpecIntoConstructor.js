var invariant = require('./invariant');
var { SpecRules, SpecPolicy } = require('../SpecPolicy');

function chain(first, second) {
	return function() {
		first.apply(this, arguments);
		second.apply(this, arguments); 
	};
}

/*
Creates a "continuation" chained function from function args first and second - eg, a chain 
of functions that are each passed the next function in the chain as their final parameter. 
Continuation functions can call next() to continue the chain or return to exit early.

Continuation functions are expected to follow the NodeJS callback interface, eg:
		function myFunction(...someArgs, nextFunction) { }
*/
function makeContinuation(first, second) {
	return function(...args) {
		var self = this;
		var params = args.slice(0, args.length - 1);

		first.apply(this, params.concat(function() {
			second.apply(self, params.concat(args[args.length - 1]));
		}));
	};
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

function mixInto(source, dest, Type, policy) {
	for (var name in source) {
		if (!source.hasOwnProperty(name)) {
			continue;
		}

		var property = source[name];
		validateMethodOverride(dest, name, policy, Type);

		if (dest.hasOwnProperty(name)) {
			var specPolicy = policy.get(name);
			if (specPolicy === SpecRules.DEFINE_MANY) {
				dest[name] = chain(dest[name], property);
			}

			if (specPolicy === SpecRules.CONTINUATION) {
				dest[name] = makeContinuation(dest[name], property);
			}
		} else {
			dest[name] = property;
		}
	}
}

module.exports = function mixSpecIntoConstructor(SpecType, Constructor, Type, policy) {
	var proto = Constructor.prototype;

	// Assume plain object spec
	var specProto = SpecType;

	if (SpecType.prototype && Object.getPrototypeOf(SpecType) !== Object.getPrototypeOf({})) {
		// Class spec
		specProto = SpecType.prototype;
	}

	if (SpecType.hasOwnProperty('mixins')) {
		SpecType.mixins.forEach((mixin) => mixInto(mixin, proto, Type, policy));
	}

	mixInto(specProto, proto, Type, policy);
};