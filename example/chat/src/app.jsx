var React = require('react');
var fluent = require('fluent-flux');
var assign = require('object-assign');

var API = require('./common/API');
var ChatSampleData = require('./ChatSampleData');
var MessageSection = require('./messages/components/MessageSection');

ChatSampleData.init();
API.getAllMessages();

var ChatApp = React.createClass({
	render() {
		return (
			<div>
				<MessageSection />
			</div>
		)
	}
});

React.render(
	<ChatApp/>,
	document.body
)