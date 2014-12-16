var ChatApp = require('../ChatApp');
var ActionTypes = require('fluent-action-types');

var ThreadActionTypes = ChatApp.addActionTypes('threads', function() {
  this.actions('CLICK_THREAD');
});

module.exports = ThreadActionTypes;