var SpecRules = {
	DEFINE_ONCE: 'DEFINE_ONCE',
	DEFINE_MANY: 'DEFINE_MANY',
	OVERRIDE_BASE: 'OVERRIDE_BASE',
	CONTINUATION: 'CONTINUATION'
}

class SpecPolicy {
	constructor(classInterface) {
		this.classInterface = classInterface;
	}

	get(name) {
		return this.classInterface.hasOwnProperty(name) ? 
			this.classInterface[name] :
			null;
	}
}

module.exports = {
	SpecRules,
	SpecPolicy
}