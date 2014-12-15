var Dispatcher = require('../core/Dispatcher');

var ThreadActions = Dispatcher.createActions({

	clickThread(threadID) {
		this.dispatch({threadID});
	}

});

module.exports = ThreadActions;