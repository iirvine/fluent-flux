var fluent = require('fluent-app');

module.exports = fluent.createApp({
  routes: require('./routes'),
  dispatcher: require('./core/Dispatcher'),
  mountNode: document.getElementById('content')
});