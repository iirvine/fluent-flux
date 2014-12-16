var ChatApp = require('../ChatApp');

var ThreadActionTypes = ChatApp.addActionTypes('threads', function() {
  this.actions('CLICK_THREAD');
});

module.exports = ThreadActionTypes;