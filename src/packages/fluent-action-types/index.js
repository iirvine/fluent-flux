var DSL = require('./DSL');

module.exports = function ActionTypes(namespace, fn) {
  return new DSL(namespace, fn).generate();
}

module.exports.ActionTypeMap = require('./ActionTypeMap');