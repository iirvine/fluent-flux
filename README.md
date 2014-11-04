#FLUENT

Fluent is a still-experimental implementation of Facebook's unidirectional [flux architecture](https://facebook.github.io/flux/). It takes some cues from libraries like [reflux](https://github.com/spoike/refluxjs) and provides a few conveniences/niceties on top of the original [reference implementation](https://github.com/facebook/flux), but without straying too far from the original precepts.

*Note*: Fluent has yet to leave the "I'm not sure this is a good idea phase" - use it at your own risk. 

##Key Differences

For example purposes, here's a portion of a trivial app implemented according to the vanilla flux specification:

__Flux__

*Constants/Constants.js*
```js
var keyMirror = require('react/lib/keyMirror');

module.exports = {

  ActionTypes: keyMirror({
    USER_BUTTON_CLICKED: null,
    RECEIVE_USER: null
  })
};
```

*actions/UserActionCreators.js*
```js
var Dispatcher = require('../common/dispatcher');
var Constants = require('../constants/Constants');
var API = require('../common/API');
var UserStore = require('../stores/UserStore');

var ActionTypes = Constants.ActionTypes;

module.exports = UserActions = {

  buttonClicked: function(username) {
    Dispatcher.dispatch({
      type: ActionTypes.USER_BUTTON_CLICKED,
      username: username
    });

    API.fetchUser(username)
        .then(UserActions.receiveUser);
  }

  receiveUser: function(user) {
    Dispatcher.dispatch({
        type: ActionTypes.RECEIVE_USER,
        user: user
    });
  }

};
```

*stores/UserStore.js*
```js
var Dispatcher = require('../common/dispatcher');
var Constants = require('../constants/Constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';
var PENDING_TOKEN = '__PENDING__';

var user = null;

var UserStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  get: function(id) {
    return _messages[id];
  },

  isPending: function() {
    return this.pendingToken == PENDING_TOKEN;
  }
});

UserStore.dispatchToken = Dispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.USER_BUTTON_CLICKED:
      console.log("You clicked the user button! Fetching user " + action.username);
      UserStore.pendingToken = PENDING_TOKEN;
      UserStore.emitChange();
      break;

    case ActionTypes.RECEIVE_USER:
      user = action.user;
      UserStore.pendingToken = null;
      UserStore.emitChange();
      break;

    default:
      // do nothing
  }

});

module.exports = MessageStore;
```

Here's the same functionality implemented with fluent:

__Fluent__

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
var { handler, ALL_ACTIONS } = fluent;

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
  handler(ALL_ACTIONS, (action, params) => {
    console.log("This special handler gets called for every event dispatched!");
  }),

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

###No Constants
Maintaining an ever-growing ActionTypes enum in "vanilla" flux quickly became bothersome and error-prone - as did the nasty switch statement each store had to declare to act on those actions. Fluent takes a page out of reflux's book and treats action functions as first-class citizens - but unlike reflux, all actions are still pumped through a central dispatcher. Stores declare their interest in different actions by declaring handlers and registering them with the dispatcher.


Under the hood, Fluent implements this API using ES6 Maps - a store's handlers are stored in a dispatch table, keyed on the actions each handler cares about. The dispatcher uses the object identity of each action being dispatched to route actions to the appropriate handlers.

###Factory Functions




###Queued Dispatches
Like flux, Fluent uses a centralized dispatcher that manages the unidirectional flow of actions through the application. However, unlike flux, Fluent's dispatcher won't throw an exception if actions are dispatched concurrently - instead, the dispatcher will queue any actions fired during the current dispatch. These actions will be flushed once the current dispatch has completed.

As cascading actions can make your application more difficult to understand, the dispatcher will log a warning to the console when it needs to queue an action.