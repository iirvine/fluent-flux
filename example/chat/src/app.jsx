var React = require('react');
var fluent = require('fluent-flux');
var assign = require('object-assign');
var API = require('./core/API');
var ChatSampleData = require('./ChatSampleData');
var MessageSection = require('./messages/components/MessageSection');
var ThreadSection = require('./threads/components/ThreadSection');

ChatSampleData.init();
API.getAllMessages();

var ChatApp = React.createClass({
	render() {
		return (
			<div>
				<ThreadSection />
				<MessageSection />
			</div>
		);
	}
});

React.render(
	<ChatApp/>,
	document.body
);