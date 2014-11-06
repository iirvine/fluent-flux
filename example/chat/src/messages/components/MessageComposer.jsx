var React = require('react');
var { createMessage } = require('../MessageActions');

var ENTER_KEY_CODE = 13;

var MessageComposer = React.createClass({
	getInitialState() {
		return {text: ''};
	},

	onChange(event, value) {
		this.setState({text: event.target.value})
	},

	onKeyDown(event) {
		if (event.keyCode === ENTER_KEY_CODE) {
			event.preventDefault();
			var text = this.state.text.trim();
			if (text) {
				createMessage(text);
			}
			this.setState({text: ''});
		}
	},

	render() {
		return (
			<textarea 
				className="message-composer" 
				name="message"
				value={this.state.text}
				onChange={this.onChange}
				onKeyDown={this.onKeyDown} />
		);
	}
});

module.exports = MessageComposer;