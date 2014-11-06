var Dispatcher = require('../common/dispatcher');

var ThreadActions = Dispatcher.createActions({

	clickThread(threadID) {
		this.dispatch({threadID});
	}

});

module.exports = ThreadActions;