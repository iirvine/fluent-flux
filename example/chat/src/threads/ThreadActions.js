var Dispatcher = require('../core/Dispatcher');
var ActionTypes = require('./ActionTypes');

var ThreadActions = Dispatcher.createActions({
	clickThread(threadID) {
		this.dispatch(ActionTypes.CLICK_THREAD, {threadID});
	}
});

module.exports = ThreadActions;