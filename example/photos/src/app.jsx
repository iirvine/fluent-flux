var React = require('react');
var fluent = require('fluent-flux');
var assign = require('object-assign');

var { UserActions, UserStore } = require('./users');

var App = React.createClass({
	getInitialState() {
		return assign({userString: ""}, this.getStateFromStores());
	},

	getStateFromStores() {
		return {
			user: UserStore.get(),
			loading: fluent.anyPending(UserStore)
		}
	},

	componentDidMount() {
		UserStore.addChangeListener(this.onChange);
	},

	onChange() {
		this.setState(this.getStateFromStores())
	},

	userInputChanged() {
		this.setState({userString: this.refs.userInput.getDOMNode().value});
	},

	userButtonClicked() {
		UserActions.buttonClicked(this.state.userString);
	},

	render() {
		return (
			<div>
				<input ref="userInput"
					type="text"
					placeholder="Username" 
					onChange={this.userInputChanged}/>

				<button onClick={this.userButtonClicked}>User Button</button>
				<div>{this.state.loading ? "Loading..." : "Loaded."}</div>
				<div>Current User: {this.state.user}</div>
			</div>
		)
	}
})

React.render(
	<App/>,
	document.body
)