var React = require('react');
var MessageComposer = require('./MessageComposer');
var MessageStore = require('../MessageStore');
var ThreadStore = require('../../threads/ThreadStore');


var MessageSection = React.createClass({
	render() {
		return (
			<div>
				<MessageComposer />
			</div>
		)
	}
})

module.exports = MessageSection;