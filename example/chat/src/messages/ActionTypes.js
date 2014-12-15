var ChatApp = require('../ChatApp');
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

ChatApp.addActionTypes(MessageActionTypes);

module.exports = MessageActionTypes;