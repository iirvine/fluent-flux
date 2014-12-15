var Dispatcher = require('../core/dispatcher');

var ThreadActions = Dispatcher.createActions({

	clickThread(threadID) {
		this.dispatch({threadID});
	}

});

module.exports = ThreadActions;