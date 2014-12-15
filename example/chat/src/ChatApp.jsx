var fluent = require('fluent-flux');

module.exports = fluent.createApp({
  routes: require('./routes'),
  dispatcher: require('./core/Dispatcher')
});