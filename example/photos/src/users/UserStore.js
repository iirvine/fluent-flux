var Dispatcher = require('../common/dispatcher');
var { changeHandler } = require('fluent-flux');
var { buttonClicked, receiveUser } = require('./UserActions');

var currentUser = null;
var dispatchToken = null;

var UserStore = Dispatcher.createStore({
	displayName: "UserStore",
	get() {
		return currentUser;
	},

	getDispatchToken() {
		return dispatchToken;
	},

	handlers: [
		changeHandler(buttonClicked, (params) => {
			console.log("Fetching user...")
			UserStore.setPending();
		}),
		
		changeHandler(receiveUser, (params) => {
			currentUser = {params};
			UserStore.resolve();
		})
	]
});

dispatchToken = Dispatcher.register(UserStore);

module.exports = UserStore