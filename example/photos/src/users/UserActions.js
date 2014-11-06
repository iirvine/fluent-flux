var Dispatcher = require('../common/dispatcher');
var API = require('../common/API');

var UserActions = Dispatcher.createActions({
	buttonClicked(user) {
		console.log(`${this.displayName()}(...): You clicked the user button!!`)
		
		this.dispatch({user});
		
		API.fetchUser(user)
			.then(UserActions.receiveUser);
	}, 

	receiveUser(user) {
		this.dispatch({user});
	}
});

module.exports = UserActions