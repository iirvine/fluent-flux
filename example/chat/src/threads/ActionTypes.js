var ChatApp = require('../ChatApp');
var ActionTypes = require('fluent-action-types');

var ThreadActionTypes = ActionTypes('threads', function() {
  this.actions('CLICK_THREAD');
});

ChatApp.addActionTypes(ThreadActionTypes);

module.exports = ThreadActionTypes;