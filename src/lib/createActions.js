var createAction = require('./createAction');

module.exports = function createActions(actions, dispatcher) {
	var definition = {};
	for (var method in actions) {
		definition[method] = createAction(actions[method], method, dispatcher);
	}

	return definition;
}