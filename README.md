#FLUENT

Fluent is a still-experimental implementation of Facebook's unidirectional [flux architecture](https://facebook.github.io/flux/). It takes some cues from libraries like [reflux](https://github.com/spoike/refluxjs) and provides a few conveniences/niceties on top of the original [reference implementation](https://github.com/facebook/flux), but without straying too far from the original precepts.

*Note*: Fluent has yet to leave the "I'm not sure this is a good idea phase" - feel free to mess around with it, but I wouldn't use it in production just yet...

##Example

Here's a trivial app implemented with fluent - see the examples directory for a full working sample:

*users/UserActions.js*
```js
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
```

*users/UserStore.js*
```js
var fluent = require('fluent-flux');
var { handler } = fluent;

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
```

*app.jsx*
```js
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
```

##Key Differences

###No Constants
Maintaining an ever-growing ActionTypes enum in "vanilla" flux seemed like an antipattern. It quickly became bothersome and error-prone - as did the nasty switch statement each store had to declare to act on those actions. Fluent takes a page out of reflux's book and treats action functions as first-class citizens - but unlike reflux, all actions are still pumped through a central dispatcher. Stores declare their interest in different actions by declaring handlers and registering them with the dispatcher.

Under the hood, Fluent implements this API using ES6 Maps - a store's handlers are stored in a dispatch table, keyed on the actions each handler cares about. The dispatcher uses the object identity of each action being dispatched to route actions to the appropriate handlers.

###Factory Functions
Due to being reference implementations, the original flux examples didn't have much abstraction to them. Fluent includes convenient factory functions for creating stores and actions, as well as helpers like `anyPending` to see if any stores have asynchronous operations pending, like an in-flight request.

###Queued Dispatches
Like flux, Fluent uses a centralized dispatcher that manages the unidirectional flow of actions through the application. However, unlike flux, Fluent's dispatcher won't throw an exception if actions are dispatched concurrently - instead, the dispatcher will queue any actions fired during the current dispatch. These actions will be flushed once the current dispatch has completed.

As cascading actions can make your application more difficult to understand, the dispatcher will log a warning to the console when it needs to queue an action.

###Questions
Feedback would be much appreciated! Feel free to file an issue or hit me up on twitter @ianirvine.

###TODO
- [ ] Decide whether any part of this is a terrible idea
- [ ] Documentation
- [ ] Tests 
- [ ] Mixins
- [ ] More examples
- [ ] Publish to npm