module.exports = function createAction(fn, name, dispatcher) {
	var functor = function() {
			fn.apply(functor, arguments);
	}

	functor.displayName = function() {
		return name;
	}

	functor.dispatch = function(params) {
		dispatcher.dispatch(functor, params)
	}

	return functor;
}