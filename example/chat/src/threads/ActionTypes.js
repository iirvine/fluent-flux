var ChatApp = require('../core/ChatApp');
var {ActionTypes} = require('fluent-flux');

var ThreadActionTypes = ActionTypes('threads', function() {
  this.actions('CLICK_THREAD');
});

ChatApp.addActionTypes(ThreadActionTypes);

module.exports = ThreadActionTypes;