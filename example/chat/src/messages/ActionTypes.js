var ChatApp = require('../ChatApp');
var ActionTypes = require('fluent-action-types');

var MessageActionTypes = ChatApp.addActionTypes('messages', function() {
  this.actions('CREATE_MESSAGE');
  
  this.namespace('server', function() {
    this.actions(
      'RECEIVE_ALL',
      'RECEIVE_CREATED_MESSAGE'
    );
  });
});

module.exports = MessageActionTypes;