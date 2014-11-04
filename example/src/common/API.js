var Dispatcher = require('./dispatcher');
var { REQUEST_DISPATCHED } = require('../common/CommonActions');

var API = {
	fetchUser(username) {
		console.log(`API is fetching user ${username}!`);
		
		Dispatcher.dispatch(REQUEST_DISPATCHED);

		return new Promise((resolve, reject) => {
			var complete = function() {
				resolve({user: username});
			}
			
			setTimeout(complete, 550);
		});
	},

	fetchPhotos() {
			console.log("API is fetchin photos!");
			return Promise.resolve("hello");
	}
}	

module.exports = API