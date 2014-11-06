var React = require('react');
var ThreadListItem = require('./ThreadListItem');
var ThreadStore = require('../ThreadStore');
var UnreadThreadStore = require('../UnreadThreadStore');
var MessageStore = require('../../messages/MessageStore');

function getStateFromStores() {
	return {
		threads: ThreadStore.getAllChrono(),
		currentThreadID: ThreadStore.getCurrentID(),
		unreadCount: UnreadThreadStore.getCount()
	}
}

var ThreadSection = React.createClass({
	getInitialState() {
		return getStateFromStores();
	},
	
	render() {
		return (
			<div>ThreadSection</div>
		)
	}
})

module.exports = ThreadSection;