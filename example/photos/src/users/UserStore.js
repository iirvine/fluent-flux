var fluent = require('fluent-flux');
var { handler, ALL_ACTIONS } = fluent;

var { buttonClicked, receiveUser } = require('./UserActions');
var Dispatcher = require('../common/dispatcher');

var currentUser = null;

var UserStore = fluent.createStore({
	displayName: "UserStore",
	get() {
		return currentUser;
	},
});

UserStore.handlers(
	handler(ALL_ACTIONS, (action, params) => {
		console.log("This special handler gets called for every event dispatched!");
	}),

	handler(buttonClicked, (params) => {
		console.log("Fetching user...")
		UserStore.setPending();
	}),
	
	handler(receiveUser, (params) => {
		currentUser = {params};
		UserStore.resolve();
	})
);

UserStore.dispatchToken = Dispatcher.register(UserStore.handlers());

module.exports = UserStore