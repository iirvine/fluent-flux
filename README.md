#FLUENT

Fluent is a still-experimental implementation of Facebook's unidirectional [flux architecture](https://facebook.github.io/flux/). It takes some cues from libraries like [reflux](https://github.com/spoike/refluxjs) and provides a few conveniences/niceties on top of the original [reference implementation](https://github.com/facebook/flux), but without straying too far from the original precepts.

*Note*: Fluent has yet to leave the "I'm not sure this is a good idea phase" - feel free to mess around with it, but I wouldn't use it in production just yet...

##Example

Here's a trivial app implemented with fluent - see the examples directory for a full working sample:

*users/ActionTypes.js*
```js
var ActionTypes = require('fluent-action-types');

var UserActionTypes = ActionTypes('users', function() {
  this.actions(
    'BUTTON_CLICKED',
    'RECEIVE_USER'
  );
});

module.exports = UserActionTypes;
```

*users/UserActions.js*
```js
var Dispatcher = require('../common/dispatcher');
var API = require('../common/API');
var ActionTypes = require('./ActionTypes');

var UserActions = Dispatcher.createActions({
  buttonClicked(user) {
    console.log(`${this.displayName()}(...): You clicked the user button!!`)
    
    this.dispatch(ActionTypes.BUTTON_CLICKED, {user});
    
    API.fetchUser(user)
      .then(UserActions.receiveUser);
  }, 

  receiveUser(user) {
    this.dispatch(ActionTypes.RECEIVE_USER, {user});
  }
});

module.exports = UserActions
```

*users/UserStore.js*
```js
var Dispatcher = require('../common/dispatcher');
var ActionTypes = require('./ActionTypes')
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
    changeHandler(ActionTypes.BUTTON_CLICKED, (params) => {
      console.log("Fetching user...")
      UserStore.setPending();
    }),
    
    changeHandler(ActionTypes.RECEIVE_USER, (params) => {
      currentUser = {params};
      UserStore.resolve();
    })
  ]
});

dispatchToken = Dispatcher.register(UserStore);

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

###ActionTypes API
Maintaining an ever-growing ActionTypes enum in "vanilla" flux seemed like an antipattern. It quickly became bothersome and error-prone - as did the nasty switch statement each store had to declare to act on those actions. Fluent uses a DSL approach to declaring the types of actions your application can emit, inspired by Ember's routing API. The [fluent-action-types](https://github.com/iirvine/fluent-action-types) package provides a simple API to build a hash of namespaced ActionType functions, which can be invoked to build an event string.

```js
var ActionTypes = require('fluent-action-types');

var MessageActionTypes = ActionTypes('messages', function() {
  this.actions('CREATE_MESSAGE');
  
  this.namespace('server', function() {
    this.actions(
      'RECEIVE_ALL',
      'RECEIVE_CREATED_MESSAGE'
    );
  });
});

console.log(MessageActionTypes.CREATE_MESSAGE)     //logs 'messages:CREATE_MESSAGE'
console.log(MessageActionTypes.server.RECEIVE_ALL) //logs 'messages:server:RECEIVE_ALL'
```

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