module.exports = function createAction(fn, name, dispatcher) {
	var functor = function() {
			fn.apply(functor, arguments);
	}

	functor.displayName = function() {
		return name;
	}

	functor.dispatch = function() {
		dispatcher.dispatch.apply(dispatcher, arguments);
	}

	return functor;
}